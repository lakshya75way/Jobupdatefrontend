import type { Request, Response } from "express";
import * as todoService from "./todo.service.js";
import { catchAsync } from "../../middlewares/error.middleware.js";
import {
  getTodoSchema,
  deleteTodoSchema,
  moveTodoSchema,
} from "./todo.validation.js";

export const getAllTodos = catchAsync(async (req: Request, res: Response) => {
  const boardId = req.query.boardId as string;
  if (!boardId) {
    res.status(400).json({ status: "fail", message: "boardId is required" });
    return;
  }

  console.log(`[Todo]  Fetching todos for board: ${boardId}`);
  const todos = await todoService.getAllTodos(boardId, req.user!.userId);
  console.log(`[Todo]  Found ${todos.length} todos`);

  res.status(200).json({
    status: "success",
    data: { todos },
  });
});

export const getTodoById = catchAsync(async (req: Request, res: Response) => {
  await getTodoSchema.parseAsync({ params: req.params });
  const { id } = req.params;
  const todo = await todoService.getTodoById(id, req.user!.userId);

  if (!todo) {
    res.status(404).json({
      status: "fail",
      message: "Todo not found or access denied",
    });
    return;
  }

  res.status(200).json({
    status: "success",
    data: { todo },
  });
});

export const deleteTodo = catchAsync(async (req: Request, res: Response) => {
  await deleteTodoSchema.parseAsync({ params: req.params });
  const { id } = req.params;
  console.log(`[Todo]   Deleting todo: ${id}`);
  const deleted = await todoService.deleteTodo(id, req.user!.userId);

  if (!deleted) {
    console.log(`[Todo]  Todo not found or access denied: ${id}`);
    res.status(404).json({
      status: "fail",
      message: "Todo not found or permission denied",
    });
    return;
  }

  console.log(`[Todo]  Todo deleted: ${id}`);
  res.status(200).json({
    status: "success",
    message: "Todo deleted successfully",
  });
});

export const moveTodo = catchAsync(async (req: Request, res: Response) => {
  await moveTodoSchema.parseAsync({ body: req.body, params: req.params });
  const { id } = req.params;
  const { newOrder } = req.body;

  const updatedTodo = await todoService.moveTodo(
    id,
    req.user!.userId,
    newOrder
  );

  res.status(200).json({
    status: "success",
    data: { todo: updatedTodo },
  });
});
