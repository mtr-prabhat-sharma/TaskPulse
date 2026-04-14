import express from "express";
import * as controller from "./comment.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/:taskId", authMiddleware, controller.add);
router.get("/:taskId", authMiddleware, controller.getAll);

export default router;