import { Request, Response } from "express";
import { prisma } from "../../config/db";

export const getNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;  

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  res.json(notifications);
};