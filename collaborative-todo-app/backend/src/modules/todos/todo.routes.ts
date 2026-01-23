import { Router } from "express";
import {
  getAllTodos,
  getTodoById,
  deleteTodo,
  moveTodo,
} from "./todo.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getAllTodos);
router.get("/:id", getTodoById);
router.delete("/:id", deleteTodo);
router.patch("/:id/move", moveTodo);

export default router;
