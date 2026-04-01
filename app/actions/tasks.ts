"use server";

import { prisma } from "@/lib/db";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus(taskId: string, newStatus: "IN_PROGRESS" | "SUBMITTED") {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") return { error: "Unauthorized" };

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { milestone: { include: { group: { include: { members: true } } } } },
  });

  if (!task) return { error: "Task not found" };
  if (task.assignedToId !== session.id) return { error: "This task is not assigned to you" };

  // Validate status transitions
  const validTransitions: Record<string, string[]> = {
    TODO: ["IN_PROGRESS"],
    IN_PROGRESS: ["SUBMITTED"],
    REVISION: ["SUBMITTED"],
    SUBMITTED: [],
    APPROVED: [],
  };

  if (!validTransitions[task.status]?.includes(newStatus)) {
    return { error: `Cannot change status from ${task.status} to ${newStatus}` };
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  // If submitting, notify the teacher
  if (newStatus === "SUBMITTED") {
    const teacherId = task.milestone.group.teacherId;
    await prisma.notification.create({
      data: {
        userId: teacherId,
        message: `📝 ${session.name} submitted task: "${task.title}" for review.`,
      },
    });
  }

  // Update milestone status if needed
  if (newStatus === "IN_PROGRESS" && task.milestone.status === "LOCKED") {
    await prisma.milestone.update({
      where: { id: task.milestoneId },
      data: { status: "IN_PROGRESS" },
    });
  }

  revalidatePath("/dashboard/student/tasks");
  revalidatePath("/dashboard/student/milestones");
  revalidatePath("/dashboard/student");
  return { success: `Task status updated to ${newStatus}` };
}
export async function createTask(
  milestoneId: string,
  title: string,
  description: string,
  assignedToId: string
) {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") return { error: "Unauthorized" };

  // Verify the milestone exists and belongs to the student's group
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: {
      group: {
        include: { members: true },
      },
    },
  });

  if (!milestone) return { error: "Milestone not found" };

  // Check if student is a member of this group
  const isMember = milestone.group.members.some((m) => m.userId === session.id);
  if (!isMember) return { error: "You are not a member of this group" };

  // Check milestone is not locked
  if (milestone.status === "LOCKED") {
    return { error: "Cannot add tasks to a locked milestone" };
  }

  // Verify assignee is a group member
  const assigneeIsMember = milestone.group.members.some(
    (m) => m.userId === assignedToId
  );
  if (!assigneeIsMember) return { error: "Assignee is not a group member" };

  const task = await prisma.task.create({
    data: {
      title,
      description: description || null,
      milestoneId,
      assignedToId,
      xpReward: 10,
      coinReward: 10,
    },
  });

  // Notify the assignee if it's someone else
  if (assignedToId !== session.id) {
    await prisma.notification.create({
      data: {
        userId: assignedToId,
        message: `📋 ${session.name} assigned you a new task: "${title}"`,
      },
    });
  }

  // If milestone was completed but now has a new incomplete task, revert to in progress
  if (milestone.status === "COMPLETED") {
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: "IN_PROGRESS" },
    });
  }

  revalidatePath("/dashboard/student/tasks");
  revalidatePath("/dashboard/student/milestones");
  revalidatePath("/dashboard/student");

  return { success: `Task "${title}" created successfully!` };
}

export async function deleteTask(taskId: string) {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") return { error: "Unauthorized" };

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      milestone: {
        include: { group: { include: { members: true } } },
      },
    },
  });

  if (!task) return { error: "Task not found" };

  const isMember = task.milestone.group.members.some(
    (m) => m.userId === session.id
  );
  if (!isMember) return { error: "You are not a member of this group" };

  // Only allow deleting TODO tasks
  if (task.status !== "TODO") {
    return { error: "Can only delete tasks that haven't been started" };
  }

  await prisma.task.delete({ where: { id: taskId } });

  revalidatePath("/dashboard/student/tasks");
  revalidatePath("/dashboard/student/milestones");
  revalidatePath("/dashboard/student");

  return { success: "Task deleted" };
}
