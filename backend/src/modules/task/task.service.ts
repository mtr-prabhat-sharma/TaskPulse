import { prisma } from "../../config/db";
import { sendNotification } from "../../services/notification.service";
import { sendWhatsAppMessage } from "../../services/whatsapp.service";


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

  
  await sendNotification(
    data.assigneeId,
    `New task assigned: ${task.title}`
  );

  
  const assignee = await prisma.user.findUnique({
    where: { id: data.assigneeId },
      select: {
    id: true,
    phone: true,
  },

  });

  if (assignee?.phone) {
    
    await sendWhatsAppMessage(
      assignee.phone,
      `New Task Assigned: ${task.title}\nDue: ${task.dueDate}`
    );
  }

  return task;
};


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


  if (manager?.phone) {
    
    await sendWhatsAppMessage(
      manager.phone,
      `Task Completed: ${task.title}`
    );
  }

  return updated;
};

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

  
  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { status: "RETURNED" },
  });

  
  await prisma.comment.create({
    data: {
      text: `Task returned: ${reason}`,
      taskId,
      userId: user.userId,
    },
  });

  return updated;
};


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