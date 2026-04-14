import { prisma } from "../../config/db";

// 🟢 CREATE TASK (Manager only)
export const createTask = async (data: any, user: any) => {
  if (user.role !== "MANAGER") {
    throw new Error("Only managers can create tasks");
  }

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: new Date(data.dueDate),
      assigneeId: data.assigneeId,
    },
  });
};

// 🟡 START TASK
export const startTask = async (taskId: string, user: any) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) throw new Error("Task not found");

  // Only assigned employee
  if (user.userId !== task.assigneeId) {
    throw new Error("Not authorized to start this task");
  }

  // Valid states
  if (task.status !== "PENDING" && task.status !== "RETURNED") {
    throw new Error("Task cannot be started");
  }

  // Create time log
  await prisma.timeLog.create({
    data: {
      taskId,
      startTime: new Date(),
    },
  });

  return prisma.task.update({
    where: { id: taskId },
    data: { status: "IN_PROGRESS" },
  });
};

// 🔵 COMPLETE TASK
export const completeTask = async (taskId: string, user: any) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) throw new Error("Task not found");

  if (user.userId !== task.assigneeId) {
    throw new Error("Not authorized");
  }

  if (task.status !== "IN_PROGRESS") {
    throw new Error("Task must be in progress");
  }

  // Close active time log
  await prisma.timeLog.updateMany({
    where: {
      taskId,
      endTime: null,
    },
    data: {
      endTime: new Date(),
    },
  });

  return prisma.task.update({
    where: { id: taskId },
    data: { status: "COMPLETED" },
  });
};

// 🟣 APPROVE TASK (Manager only)
export const approveTask = async (taskId: string, user: any) => {
  if (user.role !== "MANAGER") {
    throw new Error("Only manager can approve");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) throw new Error("Task not found");

  if (task.status !== "COMPLETED") {
    throw new Error("Task must be completed first");
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { status: "APPROVED" },
  });
};

// 🔴 RETURN TASK (Manager only)
export const returnTask = async (taskId: string, user: any) => {
  if (user.role !== "MANAGER") {
    throw new Error("Only manager can return task");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) throw new Error("Task not found");

  if (task.status !== "COMPLETED") {
    throw new Error("Task must be completed first");
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { status: "RETURNED" },
  });
};