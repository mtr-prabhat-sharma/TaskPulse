import { Request, Response } from "express";
import { loginUser } from "./auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.json(result);
  } catch (err: any) {
    console.log("ERROR:", err.message);
    res.status(400).json({ message: err.message });
  }
};