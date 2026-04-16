import { prisma } from "../config/db";

export const sendNotification = async (userId: string, message: string) => {
  // ✅ Save in DB
  await prisma.notification.create({
    data: {
      userId,
      message,
    },
  });

  console.log("🔔 Notification saved:", message);
};