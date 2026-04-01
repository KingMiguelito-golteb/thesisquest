"use server";

import { prisma } from "@/lib/db";
import { getSession } from "./auth";

export async function getAdminDashboardData() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;

  const [
    totalStudents,
    totalTeachers,
    totalGroups,
    totalTasks,
    approvedTasks,
    submittedTasks,
    revisionTasks,
    totalMilestones,
    completedMilestones,
    totalAchievementsUnlocked,
    totalCoinsEarned,
    totalPurchases,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.group.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: "APPROVED" } }),
    prisma.task.count({ where: { status: "SUBMITTED" } }),
    prisma.task.count({ where: { status: "REVISION" } }),
    prisma.milestone.count(),
    prisma.milestone.count({ where: { status: "COMPLETED" } }),
    prisma.userAchievement.count(),
    prisma.coinTransaction.aggregate({ _sum: { amount: true }, where: { amount: { gt: 0 } } }),
    prisma.userPurchase.count(),
  ]);

  // Groups with details
  const groups = await prisma.group.findMany({
    include: {
      teacher: { select: { id: true, name: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, xp: true, level: true } },
        },
      },
      milestones: {
        orderBy: { order: "asc" },
        include: {
          tasks: true,
        },
      },
    },
  });

  const groupsData = groups.map((g) => {
    const allTasks = g.milestones.flatMap((m) => m.tasks);
    const completed = allTasks.filter((t) => t.status === "APPROVED").length;
    const progress = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0;
    const completedMs = g.milestones.filter((m) => m.status === "COMPLETED").length;

    const upcomingDeadline = g.milestones
      .filter((m) => m.dueDate && m.status !== "COMPLETED")
      .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())[0]?.dueDate;

    return {
      id: g.id,
      name: g.name,
      section: g.section,
      subject: g.subject,
      teacherName: g.teacher.name,
      memberCount: g.members.length,
      progress,
      totalTasks: allTasks.length,
      completedTasks: completed,
      pendingReview: allTasks.filter((t) => t.status === "SUBMITTED").length,
      totalMilestones: g.milestones.length,
      completedMilestones: completedMs,
      upcomingDeadline,
      isAtRisk: progress < 30 && allTasks.length > 0,
    };
  });

  // Top students
  const topStudents = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, name: true, xp: true, level: true, coins: true, activeTitle: true },
    orderBy: { xp: "desc" },
    take: 10,
  });

  // Teachers with group counts
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    select: {
      id: true,
      name: true,
      email: true,
      teacherGroups: {
        select: { id: true },
      },
      feedbackGiven: {
        select: { id: true },
      },
    },
  });

  const teachersData = teachers.map((t) => ({
    id: t.id,
    name: t.name,
    email: t.email,
    groupCount: t.teacherGroups.length,
    feedbackCount: t.feedbackGiven.length,
  }));

  return {
    stats: {
      totalStudents,
      totalTeachers,
      totalGroups,
      totalTasks,
      approvedTasks,
      submittedTasks,
      revisionTasks,
      totalMilestones,
      completedMilestones,
      completionRate: totalTasks > 0 ? Math.round((approvedTasks / totalTasks) * 100) : 0,
      totalAchievementsUnlocked,
      totalCoinsEarned: totalCoinsEarned._sum.amount || 0,
      totalPurchases,
    },
    groups: groupsData,
    topStudents,
    teachers: teachersData,
  };
}

export async function getAdminUsers() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return [];

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      xp: true,
      level: true,
      coins: true,
      activeTitle: true,
      createdAt: true,
      _count: {
        select: {
          achievements: true,
          purchases: true,
          assignedTasks: true,
          teacherGroups: true,
          feedbackGiven: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return users;
}