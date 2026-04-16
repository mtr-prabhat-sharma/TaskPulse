import { prisma } from "../config/db";

export const sendNotification = async (userId: string, message: string) => {
  await prisma.notification.create({
    data: {
      userId,
      message,
    },
  });

};