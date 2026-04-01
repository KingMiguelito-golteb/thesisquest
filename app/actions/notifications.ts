"use server";

import { prisma } from "@/lib/db";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await getSession();
  if (!session) return { notifications: [], unreadCount: 0 };

  const notifications = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount };
}

export async function markNotificationRead(notificationId: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });

  revalidatePath("/dashboard");
}

export async function markAllNotificationsRead() {
  const session = await getSession();
  if (!session) return;

  await prisma.notification.updateMany({
    where: { userId: session.id, read: false },
    data: { read: true },
  });

  revalidatePath("/dashboard");
}

export async function deleteNotification(notificationId: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.notification.delete({
    where: { id: notificationId },
  });

  revalidatePath("/dashboard");
}

export async function clearAllNotifications() {
  const session = await getSession();
  if (!session) return;

  await prisma.notification.deleteMany({
    where: { userId: session.id },
  });

  revalidatePath("/dashboard");
}