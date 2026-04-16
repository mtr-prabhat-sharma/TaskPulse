import { Request, Response } from "express";
import * as service from "./user.service";

export const getUsers = async (req: Request, res: Response) => {
  const users = await service.getUsers();
  res.json(users);
};