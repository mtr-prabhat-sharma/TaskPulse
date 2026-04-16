import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = "secret";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = parts[1] as string;

  try {
    const decoded = jwt.verify(token, SECRET);

    (req as any).user = decoded; 

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};