import { prisma } from "../../config/db";

// CREATE TASK
export const createTask = async (data: any, user: any) => {
  if (user.role !== "MANAGER") {
    throw new Error("Only managers can create tasks");
  }

  return prisma.task.create({
    data: {
      ...data,
      assigneeId: data.assigneeId,
    },
  });
};

// START TASK
export const startTask = async (taskId: string, user: any) => {
  return prisma.task.update({
    where: { id: taskId },
    data: { status: "IN_PROGRESS" },
  });
};

// COMPLETE TASK
export const completeTask = async (taskId: string) => {
  return prisma.task.update({
    where: { id: taskId },
    data: { status: "COMPLETED" },
  });
};

// APPROVE TASK
export const approveTask = async (taskId: string) => {
  return prisma.task.update({
    where: { id: taskId },
    data: { status: "APPROVED" },
  });
};

// RETURN TASK
export const returnTask = async (taskId: string) => {
  return prisma.task.update({
    where: { id: taskId },
    data: { status: "RETURNED" },
  });
};