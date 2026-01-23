import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import todoRoutes from "../modules/todos/todo.routes.js";
import boardRoutes from "../modules/boards/board.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/todos", todoRoutes);
router.use("/boards", boardRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "success", message: "Server is healthy" });
});

export default router;
