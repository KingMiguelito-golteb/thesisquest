"use server";

import { prisma } from "@/lib/db";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";

export async function createGroup(
  name: string,
  section: string,
  subject: string,
  studentEmails: string[]
) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return { error: "Unauthorized" };

  // Find students by email
  const students = await prisma.user.findMany({
    where: {
      email: { in: studentEmails },
      role: "STUDENT",
    },
  });

  const notFound = studentEmails.filter(
    (e) => !students.some((s) => s.email === e)
  );

  if (notFound.length > 0) {
    return {
      error: `Students not found: ${notFound.join(", ")}. Make sure they are registered as students.`,
    };
  }

  const group = await prisma.group.create({
    data: {
      name,
      section,
      subject,
      teacherId: session.id,
      members: {
        create: students.map((s) => ({ userId: s.id })),
      },
    },
  });

  // Notify students
  for (const student of students) {
    await prisma.notification.create({
      data: {
        userId: student.id,
        message: `📚 You've been added to group "${name}" by ${session.name}. Subject: ${subject}`,
      },
    });
  }

  revalidatePath("/dashboard/teacher");
  revalidatePath("/dashboard/teacher/groups");
  return { success: `Group "${name}" created with ${students.length} members!` };
}

export async function createMilestone(
  groupId: string,
  title: string,
  description: string,
  dueDate: string | null,
  xpReward: number,
  coinReward: number
) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return { error: "Unauthorized" };

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { milestones: true, members: true },
  });

  if (!group) return { error: "Group not found" };
  if (group.teacherId !== session.id) return { error: "Not your group" };

  const nextOrder = group.milestones.length + 1;

  // First milestone is always IN_PROGRESS, rest are LOCKED
  const status = nextOrder === 1 ? "IN_PROGRESS" : "LOCKED";

  await prisma.milestone.create({
    data: {
      title,
      description: description || null,
      order: nextOrder,
      status,
      groupId,
      dueDate: dueDate ? new Date(dueDate) : null,
      xpReward,
      coinReward,
    },
  });

  // Notify group members
  for (const member of group.members) {
    await prisma.notification.create({
      data: {
        userId: member.userId,
        message: `🎯 New milestone added: "${title}" in ${group.name}`,
      },
    });
  }

  revalidatePath("/dashboard/teacher");
  revalidatePath("/dashboard/teacher/groups");
  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/student/milestones");
  return { success: `Milestone "${title}" created!` };
}

export async function addStudentToGroup(groupId: string, email: string) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return { error: "Unauthorized" };

  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) return { error: "Group not found" };
  if (group.teacherId !== session.id) return { error: "Not your group" };

  const student = await prisma.user.findUnique({
    where: { email },
  });

  if (!student) return { error: "Student not found with that email" };
  if (student.role !== "STUDENT") return { error: "User is not a student" };

  const existing = await prisma.groupMember.findUnique({
    where: { userId_groupId: { userId: student.id, groupId } },
  });

  if (existing) return { error: "Student is already in this group" };

  await prisma.groupMember.create({
    data: { userId: student.id, groupId },
  });

  await prisma.notification.create({
    data: {
      userId: student.id,
      message: `📚 You've been added to group "${group.name}" by ${session.name}`,
    },
  });

  revalidatePath("/dashboard/teacher/groups");
  return { success: `${student.name} added to ${group.name}!` };
}
export async function getAvailableStudents(groupId?: string) {
  const session = await getSession();
  if (!session || (session.role !== "TEACHER" && session.role !== "ADMIN")) {
    return [];
  }

  if (groupId) {
    // Get students NOT in this group
    const groupMembers = await prisma.groupMember.findMany({
      where: { groupId },
      select: { userId: true },
    });
    const memberIds = groupMembers.map((m) => m.userId);

    return prisma.user.findMany({
      where: {
        role: "STUDENT",
        id: { notIn: memberIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
        level: true,
        xp: true,
      },
      orderBy: { name: "asc" },
    });
  }

  // Get all students
  return prisma.user.findMany({
    where: { role: "STUDENT" },
    select: {
      id: true,
      name: true,
      email: true,
      level: true,
      xp: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function addStudentToGroupById(groupId: string, studentId: string) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return { error: "Unauthorized" };

  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) return { error: "Group not found" };
  if (group.teacherId !== session.id) return { error: "Not your group" };

  const student = await prisma.user.findUnique({ where: { id: studentId } });
  if (!student) return { error: "Student not found" };
  if (student.role !== "STUDENT") return { error: "User is not a student" };

  const existing = await prisma.groupMember.findUnique({
    where: { userId_groupId: { userId: studentId, groupId } },
  });
  if (existing) return { error: "Student is already in this group" };

  await prisma.groupMember.create({
    data: { userId: studentId, groupId },
  });

  await prisma.notification.create({
    data: {
      userId: studentId,
      message: `📚 You've been added to group "${group.name}" by ${session.name}`,
    },
  });

  revalidatePath("/dashboard/teacher/groups");
  revalidatePath("/dashboard/teacher");
  return { success: `${student.name} added to ${group.name}!` };
}

export async function createGroupWithIds(
  name: string,
  section: string,
  subject: string,
  studentIds: string[]
) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return { error: "Unauthorized" };

  if (studentIds.length === 0) {
    return { error: "Add at least one student" };
  }

  const students = await prisma.user.findMany({
    where: { id: { in: studentIds }, role: "STUDENT" },
  });

  if (students.length !== studentIds.length) {
    return { error: "Some students were not found" };
  }

  const group = await prisma.group.create({
    data: {
      name,
      section,
      subject,
      teacherId: session.id,
      members: {
        create: students.map((s) => ({ userId: s.id })),
      },
    },
  });

  for (const student of students) {
    await prisma.notification.create({
      data: {
        userId: student.id,
        message: `📚 You've been added to group "${name}" by ${session.name}. Subject: ${subject}`,
      },
    });
  }

  revalidatePath("/dashboard/teacher");
  revalidatePath("/dashboard/teacher/groups");
  return { success: `Group "${name}" created with ${students.length} members!` };
}