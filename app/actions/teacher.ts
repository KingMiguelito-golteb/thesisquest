"use server";

import { prisma } from "@/lib/db";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getTeacherDashboardData() {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return null;

  const groups = await prisma.group.findMany({
    where: { teacherId: session.id },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, xp: true, level: true, coins: true, activeTitle: true },
          },
        },
      },
      milestones: {
        orderBy: { order: "asc" },
        include: {
          tasks: {
            include: {
              assignedTo: { select: { id: true, name: true } },
              feedback: {
                include: { teacher: { select: { id: true, name: true } } },
                orderBy: { createdAt: "desc" },
              },
            },
          },
        },
      },
    },
  });

  // Calculate stats
  const allMilestones = groups.flatMap((g) => g.milestones);
  const allTasks = allMilestones.flatMap((m) => m.tasks);
  const allMembers = groups.flatMap((g) => g.members.map((m) => m.user));
  const uniqueStudents = [...new Map(allMembers.map((s) => [s.id, s])).values()];

  const stats = {
    totalGroups: groups.length,
    totalStudents: uniqueStudents.length,
    totalTasks: allTasks.length,
    pendingReview: allTasks.filter((t) => t.status === "SUBMITTED").length,
    approvedTasks: allTasks.filter((t) => t.status === "APPROVED").length,
    revisionTasks: allTasks.filter((t) => t.status === "REVISION").length,
    totalMilestones: allMilestones.length,
    completedMilestones: allMilestones.filter((m) => m.status === "COMPLETED").length,
  };

  // Recent submissions awaiting review
  const pendingTasks = allTasks
    .filter((t) => t.status === "SUBMITTED")
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 10)
    .map((t) => {
      const milestone = allMilestones.find((m) => m.id === t.milestoneId);
      const group = groups.find((g) => g.id === milestone?.groupId);
      return {
        id: t.id,
        title: t.title,
        description: t.description,
        assignedTo: t.assignedTo,
        groupName: group?.name || "",
        groupSection: group?.section || "",
        milestoneName: milestone?.title || "",
        xpReward: t.xpReward,
        coinReward: t.coinReward,
        updatedAt: t.updatedAt,
        feedbackCount: t.feedback.length,
      };
    });

  // Recent feedback given
  const recentFeedback = allTasks
    .flatMap((t) =>
      t.feedback
        .filter((f) => f.teacherId === session.id)
        .map((f) => ({
          id: f.id,
          content: f.content,
          type: f.type,
          createdAt: f.createdAt,
          taskTitle: t.title,
          studentName: t.assignedTo?.name || "Unknown",
        }))
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  // At-risk groups (groups behind schedule)
  const groupsData = groups.map((g) => {
    const totalTasks = g.milestones.flatMap((m) => m.tasks).length;
    const completedTasks = g.milestones.flatMap((m) => m.tasks).filter((t) => t.status === "APPROVED").length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalMilestones = g.milestones.length;
    const completedMilestones = g.milestones.filter((m) => m.status === "COMPLETED").length;

    // Find nearest deadline
    const upcomingDeadline = g.milestones
      .filter((m) => m.dueDate && m.status !== "COMPLETED")
      .sort((a, b) => (a.dueDate!.getTime() - b.dueDate!.getTime()))
      [0]?.dueDate;

    return {
      id: g.id,
      name: g.name,
      section: g.section,
      subject: g.subject,
      members: g.members.map((m) => m.user),
      progress,
      totalTasks,
      completedTasks,
      totalMilestones,
      completedMilestones,
      pendingReview: g.milestones.flatMap((m) => m.tasks).filter((t) => t.status === "SUBMITTED").length,
      upcomingDeadline,
      milestones: g.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        status: m.status,
        order: m.order,
        dueDate: m.dueDate,
        taskCount: m.tasks.length,
        completedTaskCount: m.tasks.filter((t) => t.status === "APPROVED").length,
      })),
    };
  });

  return {
    stats,
    groups: groupsData,
    pendingTasks,
    recentFeedback,
  };
}

export async function getTeacherReviewTasks() {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return [];

  const groups = await prisma.group.findMany({
    where: { teacherId: session.id },
    include: {
      milestones: {
        include: {
          tasks: {
            where: { status: { in: ["SUBMITTED", "REVISION"] } },
            include: {
              assignedTo: { select: { id: true, name: true, level: true } },
              feedback: {
                include: { teacher: { select: { id: true, name: true } } },
                orderBy: { createdAt: "desc" },
              },
            },
            orderBy: { updatedAt: "desc" },
          },
        },
      },
    },
  });

  return groups.flatMap((g) =>
    g.milestones.flatMap((m) =>
      m.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        xpReward: t.xpReward,
        coinReward: t.coinReward,
        updatedAt: t.updatedAt,
        assignedTo: t.assignedTo,
        groupName: g.name,
        groupSection: g.section,
        milestoneName: m.title,
        feedback: t.feedback.map((f) => ({
          id: f.id,
          content: f.content,
          type: f.type,
          createdAt: f.createdAt,
          teacherName: f.teacher.name,
        })),
      }))
    )
  ).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function reviewTask(
  taskId: string,
  action: "APPROVE" | "REQUEST_REVISION",
  feedbackContent: string
) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return { error: "Unauthorized" };

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      milestone: {
        include: {
          group: true,
          tasks: true,
        },
      },
    },
  });

  if (!task) return { error: "Task not found" };
  if (task.milestone.group.teacherId !== session.id) return { error: "Not your group" };
  if (task.status !== "SUBMITTED") return { error: "Task is not submitted for review" };

  if (action === "APPROVE") {
    // Check if this is a first-try approval (no previous revision requests)
    const previousRevisions = await prisma.feedback.count({
      where: { taskId, type: "REVISION_REQUEST" },
    });
    const isFirstTry = previousRevisions === 0;

    // Approve the task
    await prisma.$transaction([
      prisma.task.update({
        where: { id: taskId },
        data: { status: "APPROVED" },
      }),
      prisma.feedback.create({
        data: {
          taskId,
          teacherId: session.id,
          content: feedbackContent || "Task approved. Great work!",
          type: "APPROVAL",
        },
      }),
      // Award XP and coins to the student
      ...(task.assignedToId
        ? [
            prisma.user.update({
              where: { id: task.assignedToId },
              data: {
                xp: { increment: task.xpReward },
                coins: { increment: task.coinReward + (isFirstTry ? 5 : 0) },
              },
            }),
            prisma.coinTransaction.create({
              data: {
                userId: task.assignedToId,
                amount: task.coinReward,
                reason: `Task approved: ${task.title}`,
              },
            }),
            ...(isFirstTry
              ? [
                  prisma.coinTransaction.create({
                    data: {
                      userId: task.assignedToId,
                      amount: 5,
                      reason: "First-try approval bonus!",
                    },
                  }),
                ]
              : []),
            prisma.notification.create({
              data: {
                userId: task.assignedToId,
                message: `✅ ${session.name} approved your task: "${task.title}". +${task.xpReward} XP, +${task.coinReward}${isFirstTry ? "+5" : ""} QC!`,
              },
            }),
          ]
        : []),
    ]);

    // Check if all tasks in the milestone are approved
    const allMilestoneTasks = task.milestone.tasks;
    const allApprovedAfterThis = allMilestoneTasks.every(
      (t) => t.id === taskId || t.status === "APPROVED"
    );

    if (allApprovedAfterThis) {
      await prisma.milestone.update({
        where: { id: task.milestoneId },
        data: { status: "COMPLETED" },
      });

      // Award milestone completion rewards
      if (task.assignedToId) {
        const groupMembers = await prisma.groupMember.findMany({
          where: { groupId: task.milestone.groupId },
        });

        for (const member of groupMembers) {
          await prisma.user.update({
            where: { id: member.userId },
            data: {
              xp: { increment: task.milestone.xpReward },
              coins: { increment: task.milestone.coinReward },
            },
          });

          await prisma.coinTransaction.create({
            data: {
              userId: member.userId,
              amount: task.milestone.coinReward,
              reason: `Milestone completed: ${task.milestone.title}`,
            },
          });

          await prisma.notification.create({
            data: {
              userId: member.userId,
              message: `🎯 Milestone completed: "${task.milestone.title}"! +${task.milestone.xpReward} XP, +${task.milestone.coinReward} QC!`,
            },
          });
        }

        // Unlock next milestone
        const nextMilestone = await prisma.milestone.findFirst({
          where: {
            groupId: task.milestone.groupId,
            order: task.milestone.order + 1,
          },
        });

        if (nextMilestone && nextMilestone.status === "LOCKED") {
          await prisma.milestone.update({
            where: { id: nextMilestone.id },
            data: { status: "IN_PROGRESS" },
          });

          for (const member of groupMembers) {
            await prisma.notification.create({
              data: {
                userId: member.userId,
                message: `🔓 New milestone unlocked: "${nextMilestone.title}"!`,
              },
            });
          }
        }
      }
    }

    // Level up check
    if (task.assignedToId) {
      const updatedStudent = await prisma.user.findUnique({
        where: { id: task.assignedToId },
      });
      if (updatedStudent) {
        const newLevel = Math.floor(updatedStudent.xp / 100) + 1;
        if (newLevel > updatedStudent.level) {
          await prisma.user.update({
            where: { id: task.assignedToId },
            data: { level: newLevel },
          });
          await prisma.notification.create({
            data: {
              userId: task.assignedToId,
              message: `⬆️ LEVEL UP! You are now Level ${newLevel}!`,
            },
          });
        }
      }
    }
  } else {
    // Request revision
    await prisma.$transaction([
      prisma.task.update({
        where: { id: taskId },
        data: { status: "REVISION" },
      }),
      prisma.feedback.create({
        data: {
          taskId,
          teacherId: session.id,
          content: feedbackContent,
          type: "REVISION_REQUEST",
        },
      }),
      ...(task.assignedToId
        ? [
            prisma.notification.create({
              data: {
                userId: task.assignedToId,
                message: `📝 ${session.name} requested revisions on: "${task.title}". Check the feedback.`,
              },
            }),
          ]
        : []),
    ]);
  }

  revalidatePath("/dashboard/teacher");
  revalidatePath("/dashboard/teacher/review");
  revalidatePath("/dashboard/teacher/groups");
  revalidatePath("/dashboard/teacher/feedback");
  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/student/tasks");

  return {
    success: action === "APPROVE"
      ? `Task approved! Student earned +${task.xpReward} XP and +${task.coinReward} QC.`
      : "Revision requested. Student has been notified.",
  };
}

export async function getTeacherFeedbackHistory() {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return [];

  const feedback = await prisma.feedback.findMany({
    where: { teacherId: session.id },
    include: {
      task: {
        include: {
          assignedTo: { select: { id: true, name: true } },
          milestone: {
            include: {
              group: { select: { name: true, section: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return feedback.map((f) => ({
    id: f.id,
    content: f.content,
    type: f.type,
    createdAt: f.createdAt,
    taskTitle: f.task.title,
    studentName: f.task.assignedTo?.name || "Unknown",
    groupName: f.task.milestone.group.name,
    groupSection: f.task.milestone.group.section,
    milestoneName: f.task.milestone.title,
  }));
}