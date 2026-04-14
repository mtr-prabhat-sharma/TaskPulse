import { Request, Response } from "express";
import * as commentService from "./comment.service";

export const add = async (req: any, res: Response) => {
  try {
    const { text } = req.body;
    const taskId = req.params.taskId;

    const comment = await commentService.addComment(
      taskId,
      req.user,
      text
    );

    res.json(comment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAll = async (req: any, res: Response) => {
  const comments = await commentService.getComments(req.params.taskId);
  res.json(comments);
};