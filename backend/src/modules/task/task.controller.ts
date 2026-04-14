import { Request, Response } from "express";
import * as taskService from "./task.service";

export const create = async (req: any, res: Response) => {
  try {
    const task = await taskService.createTask(req.body, req.user);
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const start = async (req: any, res: Response) => {
  const task = await taskService.startTask(req.params.id, req.user);
  res.json(task);
};

export const complete = async (req: any, res: Response) => {
  const task = await taskService.completeTask(req.params.id);
  res.json(task);
};

export const approve = async (req: any, res: Response) => {
  const task = await taskService.approveTask(req.params.id);
  res.json(task);
};

export const returnTask = async (req: any, res: Response) => {
  const task = await taskService.returnTask(req.params.id);
  res.json(task);
};