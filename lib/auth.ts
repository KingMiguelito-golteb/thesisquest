import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return {
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
    loginStreak: user.loginStreak,
    lastLoginDate: user.lastLoginDate,
  };
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: "STUDENT" | "TEACHER" | "ADMIN" = "STUDENT"
) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}