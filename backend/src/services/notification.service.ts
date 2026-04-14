import { getIO } from "../socket";

export const sendNotification = (userId: string, message: string) => {
  const io = getIO();

  io.to(userId).emit("notification", {
    message,
    time: new Date(),
  });
};