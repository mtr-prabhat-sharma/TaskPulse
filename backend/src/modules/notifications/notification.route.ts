import express from "express";
import { getNotifications } from "../notifications/notification.contoller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);

export default router;