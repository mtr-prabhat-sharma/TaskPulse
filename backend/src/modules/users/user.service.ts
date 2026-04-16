import { prisma } from "../../config/db";

export const getUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
};