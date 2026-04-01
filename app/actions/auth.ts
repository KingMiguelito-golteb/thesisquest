"use server";

import { cookies } from "next/headers";
import { authenticateUser, registerUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await authenticateUser(email, password);

  if (!user) {
    return { error: "Invalid email or password" };
  }

    // Update login streak
  const now = new Date();
  const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
  let newStreak = 1;

  if (lastLogin) {
    const diffDays = Math.floor(
      (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      newStreak = (user.loginStreak || 0) + 1;
    } else if (diffDays === 0) {
      newStreak = user.loginStreak || 1;
    }
  }

  // Award streak coins
  let streakCoins = 0;
  if (newStreak >= 3 && newStreak !== (user.loginStreak || 0)) {
    streakCoins = 5;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      loginStreak: newStreak,
      lastLoginDate: now,
      ...(streakCoins > 0 ? { coins: { increment: streakCoins } } : {}),
    },
  });

  if (streakCoins > 0) {
    await prisma.coinTransaction.create({
      data: {
        userId: user.id,
        amount: streakCoins,
        reason: `${newStreak}-day login streak bonus!`,
      },
    });
    await prisma.notification.create({
      data: {
        userId: user.id,
        message: `🔥 ${newStreak}-day login streak! +${streakCoins} QC bonus!`,
      },
    });
  }
  // Set a simple session cookie
  const sessionData = JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    xp: user.xp,
    level: user.level,
    avatar: user.avatar,
    coins: user.coins,
    activeTitle: user.activeTitle,
    activeFrame: user.activeFrame,
    activeIcon: user.activeIcon,
  });

  const cookieStore = await cookies();
  cookieStore.set("session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  // Redirect based on role
  switch (user.role) {
    case "ADMIN":
      redirect("/dashboard/admin");
    case "TEACHER":
      redirect("/dashboard/teacher");
    case "STUDENT":
      redirect("/dashboard/student");
    default:
      redirect("/dashboard/student");
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = (formData.get("role") as string) || "STUDENT";

  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    await registerUser(
      name,
      email,
      password,
      role as "STUDENT" | "TEACHER" | "ADMIN"
    );
    return { success: "Account created successfully! You can now log in." };
  } catch {
    return { error: "An account with this email already exists" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/");
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session.value) as {
      id: string;
      name: string;
      email: string;
      role: "STUDENT" | "TEACHER" | "ADMIN";
      xp: number;
      level: number;
      avatar: string | null;
      coins: number;
      activeTitle: string | null;
      activeFrame: string | null;
      activeIcon: string | null;
    };
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      xp: true,
      level: true,
      avatar: true,
    },
  });

  return user;
}