import { prisma } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "secret"; 

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found");

  const isValid = password === user.password;

  if (!isValid) throw new Error("Invalid password");

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET
  );

  return { token, user };
};