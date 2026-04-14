import { prisma } from "../../config/db";

// ADD COMMENT
export const addComment = async (taskId: string, user: any, text: string) => {
  // Check task exists
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) throw new Error("Task not found");

  // Only manager or assigned employee
  if (user.userId !== task.assigneeId && user.role !== "MANAGER") {
    throw new Error("Not authorized");
  }

  return prisma.comment.create({
    data: {
      text,
      taskId,
      userId: user.userId,
    },
  });
};

// GET COMMENTS
export const getComments = async (taskId: string) => {
  return prisma.comment.findMany({
    where: { taskId },
    orderBy: { createdAt: "asc" },
  });
};