"use server";

import { prisma } from "@/lib/db";
import { getSession } from "./auth";

export async function getStudentDashboardData() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") return null;

  // Get user with fresh data
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      achievements: {
        include: { achievement: true },
      },
      notifications: {
        where: { read: false },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) return null;

  // Get the student's group
  const groupMembership = await prisma.groupMember.findFirst({
    where: { userId: session.id },
    include: {
      group: {
        include: {
          teacher: {
            select: { id: true, name: true, email: true },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  xp: true,
                  level: true,
                  avatar: true,
                },
              },
            },
          },
          milestones: {
            orderBy: { order: "asc" },
            include: {
              tasks: {
                include: {
                  assignedTo: {
                    select: { id: true, name: true },
                  },
                  feedback: {
                    include: {
                      teacher: {
                        select: { id: true, name: true },
                      },
                    },
                    orderBy: { createdAt: "desc" },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!groupMembership) {
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        avatar: user.avatar,
      },
      group: null,
      milestones: [],
      stats: {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        submittedTasks: 0,
        totalMilestones: 0,
        completedMilestones: 0,
        overallProgress: 0,
      },
      achievements: user.achievements.map((ua) => ({
        ...ua.achievement,
        unlockedAt: ua.unlockedAt,
      })),
      notifications: user.notifications,
      recentFeedback: [],
    };
  }

  const group = groupMembership.group;
  const milestones = group.milestones;

  // Calculate stats
  const allTasks = milestones.flatMap((m) => m.tasks);
  const myTasks = allTasks.filter((t) => t.assignedToId === session.id);

  const totalTasks = myTasks.length;
  const completedTasks = myTasks.filter((t) => t.status === "APPROVED").length;
  const pendingTasks = myTasks.filter(
    (t) => t.status === "TODO" || t.status === "IN_PROGRESS"
  ).length;
  const submittedTasks = myTasks.filter(
    (t) => t.status === "SUBMITTED"
  ).length;
  const revisionTasks = myTasks.filter(
    (t) => t.status === "REVISION"
  ).length;

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(
    (m) => m.status === "COMPLETED"
  ).length;

  // Overall progress based on all tasks in the group
  const allGroupTasks = allTasks.length;
  const allGroupCompleted = allTasks.filter(
    (t) => t.status === "APPROVED"
  ).length;
  const overallProgress =
    allGroupTasks > 0
      ? Math.round((allGroupCompleted / allGroupTasks) * 100)
      : 0;

  // Recent feedback for this student
  const recentFeedback = allTasks
    .filter((t) => t.assignedToId === session.id)
    .flatMap((t) =>
      t.feedback.map((f) => ({
        id: f.id,
        content: f.content,
        type: f.type,
        createdAt: f.createdAt,
        teacherName: f.teacher.name,
        taskTitle: t.title,
      }))
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      xp: user.xp,
      level: user.level,
      avatar: user.avatar,
    },
    group: {
      id: group.id,
      name: group.name,
      section: group.section,
      subject: group.subject,
      teacher: group.teacher,
      members: group.members.map((m) => m.user),
    },
    milestones: milestones.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      order: m.order,
      status: m.status,
      dueDate: m.dueDate,
      xpReward: m.xpReward,
      tasks: m.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        xpReward: t.xpReward,
        dueDate: t.dueDate,
        assignedTo: t.assignedTo,
        feedbackCount: t.feedback.length,
      })),
      taskCount: m.tasks.length,
      completedTaskCount: m.tasks.filter((t) => t.status === "APPROVED").length,
    })),
    stats: {
      totalTasks,
      completedTasks,
      pendingTasks,
      submittedTasks,
      revisionTasks,
      totalMilestones,
      completedMilestones,
      overallProgress,
    },
    achievements: user.achievements.map((ua) => ({
      ...ua.achievement,
      unlockedAt: ua.unlockedAt,
    })),
    notifications: user.notifications,
    recentFeedback,
  };
}

export async function getLeaderboardData() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: {
      id: true,
      name: true,
      xp: true,
      level: true,
      avatar: true,
      activeTitle: true,
      activeFrame: true,
      activeIcon: true,
      activeFlair: true,
      achievements: {
        select: { id: true },
      },
    },
    orderBy: { xp: "desc" },
    take: 20,
  });

  return students.map((s, index) => ({
    rank: index + 1,
    id: s.id,
    name: s.name,
    xp: s.xp,
    level: s.level,
    avatar: s.avatar,
    activeTitle: s.activeTitle,
    activeFrame: s.activeFrame,
    activeIcon: s.activeIcon,
    activeFlair: s.activeFlair,
    achievementCount: s.achievements.length,
  }));
}

export async function getStudentAchievements() {
  const session = await getSession();
  if (!session) return { unlocked: [], locked: [] };

  const allAchievements = await prisma.achievement.findMany();
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId: session.id },
    include: { achievement: true },
  });

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

  const unlocked = userAchievements.map((ua) => ({
    ...ua.achievement,
    unlockedAt: ua.unlockedAt,
  }));

  const locked = allAchievements.filter((a) => !unlockedIds.has(a.id));

  return { unlocked, locked };
}

export async function getStudentNotifications() {
  const session = await getSession();
  if (!session) return [];

  const notifications = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return notifications;
}

export async function markNotificationRead(notificationId: string) {
  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function markAllNotificationsRead() {
  const session = await getSession();
  if (!session) return;

  await prisma.notification.updateMany({
    where: { userId: session.id, read: false },
    data: { read: true },
  });
}