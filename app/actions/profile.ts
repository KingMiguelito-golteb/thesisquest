"use server";

import { prisma } from "@/lib/db";
import { getSession } from "./auth";

export async function getProfileData() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      achievements: {
        include: { achievement: true },
        orderBy: { unlockedAt: "desc" },
      },
      purchases: {
        include: { shopItem: true },
        orderBy: { purchasedAt: "desc" },
      },
      coinHistory: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      groupMemberships: {
        include: {
          group: {
            include: {
              teacher: { select: { name: true } },
              milestones: {
                include: { tasks: true },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
      assignedTasks: {
        orderBy: { updatedAt: "desc" },
      },
      notifications: {
        where: { read: false },
      },
    },
  });

  if (!user) return null;

  const totalTasks = user.assignedTasks.length;
  const completedTasks = user.assignedTasks.filter((t) => t.status === "APPROVED").length;
  const group = user.groupMemberships[0]?.group;

  let groupProgress = 0;
  if (group) {
    const allTasks = group.milestones.flatMap((m) => m.tasks);
    const allCompleted = allTasks.filter((t) => t.status === "APPROVED").length;
    groupProgress = allTasks.length > 0 ? Math.round((allCompleted / allTasks.length) * 100) : 0;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    xp: user.xp,
    level: user.level,
    coins: user.coins,
    activeTitle: user.activeTitle,
    activeFrame: user.activeFrame,
    activeIcon: user.activeIcon,
    activeFlair: user.activeFlair,
    loginStreak: user.loginStreak,
    createdAt: user.createdAt,
    totalTasks,
    completedTasks,
    taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    achievementCount: user.achievements.length,
    purchaseCount: user.purchases.length,
    unreadNotifications: user.notifications.length,
    groupName: group?.name || null,
    groupSection: group?.section || null,
    groupSubject: group?.subject || null,
    adviserName: group?.teacher.name || null,
    groupProgress,
    recentAchievements: user.achievements.slice(0, 5).map((a) => ({
      title: a.achievement.title,
      description: a.achievement.description,
      unlockedAt: a.unlockedAt,
    })),
    ownedItems: user.purchases.map((p) => ({
      name: p.shopItem.name,
      category: p.shopItem.category,
      rarity: p.shopItem.rarity,
    })),
  };
}