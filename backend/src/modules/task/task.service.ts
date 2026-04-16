import { prisma } from "../../config/db";
import { sendNotification } from "../../services/notification.service";
import { sendWhatsAppMessage } from "../../services/whatsapp.service";

// 🟢 CREATE TASK (Manager only)
export const createTask = async (data: any, user: any) => {
  if (user.role !== "MANAGER") {
    throw new Error("Only managers can create tasks");
  }

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: new Date(data.dueDate),
      assigneeId: data.assigneeId,
    },
  });

  // 🔔 In-app notification
  await sendNotification(
    data.assigneeId,
    `New task assigned: ${task.title}`
  );

  // 📲 WhatsApp notification
  const assignee = await prisma.user.findUnique({
    where: { id: data.assigneeId },
      select: {
    id: true,
    phone: true,
  },

  });

  if (assignee?.phone) {
    console.log("📲 Sending WhatsApp (Task Assigned)");
    await sendWhatsAppMessage(
      assignee.phone,
      `📌 New Task Assigned: ${task.title}\nDue: ${task.dueDate}`
    );
  }

  return task;
};

// 🟡 START TASK
export const startTask = async (taskId: string, user: any) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) throw new Error("Task not found");

  if (user.userId !== task.assigneeId) {
    throw new Error("Not authorized to start this task");
  }

  if (task.status !== "PENDING" && task.status !== "RETURNED") {
    throw new Error("Task cannot be started");
  }

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

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { status: "COMPLETED" },
  });

  // 🔔 Notify manager (in-app)
  const manager = await prisma.user.findFirst({
    where: { role: "MANAGER" },
    select: {
      id: true,
      phone: true,
    },
  });

  if (manager) {
    await sendNotification(
      manager.id,
      `Task completed: ${task.title}`
    );
  }

  // 📲 WhatsApp to manager
  if (manager?.phone) {
    console.log("📲 Sending WhatsApp (Task Completed)");
    await sendWhatsAppMessage(
      manager.phone,
      `✅ Task Completed: ${task.title}`
    );
  }

  return updated;
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
export const returnTask = async (
  taskId: string,
  user: any,
  reason: string
) => {
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

  // 🔁 Update status
  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { status: "RETURNED" },
  });

  // 💬 Auto comment (IMPORTANT for assignment)
  await prisma.comment.create({
    data: {
      text: `Task returned: ${reason}`,
      taskId,
      userId: user.userId,
    },
  });

  return updated;
};

// 📋 GET TASKS
export const getTasks = async () => {
  return prisma.task.findMany({
    include: {
      assignee: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  });
};