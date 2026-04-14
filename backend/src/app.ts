import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import taskRoutes from "./modules/task/task.routes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/auth", authRoutes);

app.use("/tasks", taskRoutes);

export default app;