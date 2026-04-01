"use server";

import { prisma } from "@/lib/db";
import { getSession } from "./auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getShopData() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      coins: true,
      activeTitle: true,
      activeFrame: true,
      activeIcon: true,
      activeFlair: true,
      purchases: {
        include: { shopItem: true },
      },
    },
  });

  const shopItems = await prisma.shopItem.findMany({
    orderBy: { price: "asc" },
  });

  const purchasedIds = new Set(user?.purchases.map((p) => p.shopItemId) || []);

return {
  coins: user?.coins || 0,
  activeTitle: user?.activeTitle ?? null,
  activeFrame: user?.activeFrame ?? null,
  activeIcon: user?.activeIcon ?? null,
  activeFlair: user?.activeFlair ?? null,
  items: shopItems.map((item) => ({
    ...item,
    owned: purchasedIds.has(item.id),
  })),
};
}

export async function purchaseItem(itemId: string) {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { purchases: true },
  });

  if (!user) return { error: "User not found" };

  const item = await prisma.shopItem.findUnique({
    where: { id: itemId },
  });

  if (!item) return { error: "Item not found" };

  // Check if already purchased
  const alreadyOwned = user.purchases.some((p) => p.shopItemId === itemId);
  if (alreadyOwned) return { error: "You already own this item" };

  // Check if enough coins
  if (user.coins < item.price) {
    return { error: `Not enough Quest Coins. You need ${item.price - user.coins} more QC.` };
  }

  // Process purchase
  await prisma.$transaction([
    prisma.userPurchase.create({
      data: { userId: session.id, shopItemId: itemId },
    }),
    prisma.user.update({
      where: { id: session.id },
      data: { coins: { decrement: item.price } },
    }),
    prisma.coinTransaction.create({
      data: {
        userId: session.id,
        amount: -item.price,
        reason: `Purchased: ${item.name} (${item.category})`,
      },
    }),
    prisma.notification.create({
      data: {
        userId: session.id,
        message: `🛒 You purchased "${item.name}" for ${item.price} QC!`,
      },
    }),
  ]);

  // Update session cookie with new coin count
  const updatedUser = await prisma.user.findUnique({
    where: { id: session.id },
  });

  if (updatedUser) {
    const cookieStore = await cookies();
    const sessionData = JSON.stringify({
      ...session,
      coins: updatedUser.coins,
    });
    cookieStore.set("session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  revalidatePath("/dashboard/student/shop");
  return { success: `Successfully purchased "${item.name}"!` };
}

export async function equipItem(category: string, value: string | null) {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }

  const updateData: Record<string, string | null> = {};

  switch (category) {
    case "TITLE":
      updateData.activeTitle = value;
      break;
    case "FRAME":
      updateData.activeFrame = value;
      break;
    case "ICON":
      updateData.activeIcon = value;
      break;
    case "FLAIR":
      updateData.activeFlair = value;
      break;
    default:
      return { error: "Invalid category" };
  }

  await prisma.user.update({
    where: { id: session.id },
    data: updateData,
  });

  // Update session
  const cookieStore = await cookies();
  const sessionData = JSON.stringify({
    ...session,
    ...updateData,
  });
  cookieStore.set("session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  revalidatePath("/dashboard/student/shop");
  revalidatePath("/dashboard/student");
  return { success: value ? `Equipped "${value}"!` : "Item unequipped!" };
}

export async function getCoinHistory() {
  const session = await getSession();
  if (!session) return [];

  return prisma.coinTransaction.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
}