import express from "express";
import * as controller from "./task.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, controller.create);
router.patch("/:id/start", authMiddleware, controller.start);
router.patch("/:id/complete", authMiddleware, controller.complete);
router.patch("/:id/approve", authMiddleware, controller.approve);
router.patch("/:id/return", authMiddleware, controller.returnTask);

export default router;