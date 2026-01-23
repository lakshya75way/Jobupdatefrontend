import Todo, { ITodoDocument } from "../../models/todo.model.js";
import Board from "../../models/board.model.js";
import { ITodo } from "../../types/app.types.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { IUser } from "../../models/user.model.js";
import mongoose from "mongoose";

const getNextOrder = async (boardId: string): Promise<number> => {
  const last = await Todo.findOne({ boardId }).sort({ order: -1 });
  return last ? last.order + 1 : 0;
};

const mapToDto = (todo: ITodoDocument): ITodo => {
  const creator = todo.createdBy as unknown as IUser;
  const modifier = todo.lastModifiedBy as unknown as IUser;

  return {
    id: todo.todoId,
    text: todo.text,
    description: todo.description,
    completed: todo.completed,
    version: todo.version,
    lastModified: todo.lastModified,
    clientId: todo.clientId,
    boardId: todo.boardId.toString(),
    order: todo.order || 0,
    metadata: todo.metadata ? Object.fromEntries(todo.metadata) : {},
    history:
      todo.history?.map((h) => ({
        action: h.action,
        performedBy: h.performedBy?.toString(),
        timestamp: h.timestamp,
        details: h.details,
      })) || [],
    createdBy: creator?._id?.toString() || todo.createdBy?.toString(),
    createdByName: creator?.name || "Unknown",
    lastModifiedByName: modifier?.name || "Unknown",
  };
};

export const syncTodo = async (
  todoData: ITodo,
  userId: string,
  boardId: string
): Promise<ITodo | null> => {
  const board = await Board.findById(boardId);
  if (!board) throw new AppError("Board not found", 404);

  const isCollab = board.collaborators.some(
    (c) =>
      c.userId.toString() === userId &&
      c.role !== "viewer" &&
      c.status === "accepted"
  );
  if (board.owner.toString() !== userId && !isCollab) {
    throw new AppError("You don't have permission to modify this board", 403);
  }

  const existingTodo = await Todo.findOne({ todoId: todoData.id }).populate(
    "createdBy",
    "name"
  );

  if (!existingTodo) {
    const newTodo = new Todo({
      todoId: todoData.id,
      text: todoData.text,
      description: todoData.description,
      completed: todoData.completed,
      version: todoData.version,
      lastModified: todoData.lastModified,
      clientId: todoData.clientId,
      userId: new mongoose.Types.ObjectId(userId),
      boardId: new mongoose.Types.ObjectId(boardId),
      createdBy: new mongoose.Types.ObjectId(userId),
      lastModifiedBy: new mongoose.Types.ObjectId(userId),
      order: await getNextOrder(boardId),
      metadata: todoData.metadata || {},
      history: [
        {
          action: "created",
          performedBy: new mongoose.Types.ObjectId(userId),
          timestamp: new Date(),
        },
      ],
    });
    const saved = await newTodo.save();
    const populated = await saved.populate("createdBy", "name");
    await populated.populate("lastModifiedBy", "name");
    return mapToDto(populated as unknown as ITodoDocument);
  }

  if (
    todoData.version > existingTodo.version ||
    (todoData.version === existingTodo.version &&
      todoData.lastModified > existingTodo.lastModified)
  ) {
    existingTodo.text = todoData.text;
    if (todoData.description !== undefined)
      existingTodo.description = todoData.description;
    existingTodo.completed = todoData.completed;
    existingTodo.version = todoData.version;
    existingTodo.lastModified = todoData.lastModified;
    existingTodo.clientId = todoData.clientId;
    existingTodo.lastModifiedBy = new mongoose.Types.ObjectId(userId);

    if (todoData.metadata)
      existingTodo.metadata = new Map(Object.entries(todoData.metadata));
    if (todoData.order !== undefined) existingTodo.order = todoData.order;

    existingTodo.history.push({
      action: "updated",
      performedBy: new mongoose.Types.ObjectId(userId),
      timestamp: new Date(),
      details: "Synced update",
    });

    const saved = await existingTodo.save();
    const populated = await saved.populate("createdBy", "name");
    await populated.populate("lastModifiedBy", "name");
    return mapToDto(populated as unknown as ITodoDocument);
  }

  return null;
};

export const getAllTodos = async (
  boardId: string,
  userId: string
): Promise<ITodo[]> => {
  const board = await Board.findById(boardId);
  if (!board) throw new AppError("Board not found", 404);

  const isCollab = board.collaborators.some(
    (c) => c.userId.toString() === userId && c.status === "accepted"
  );
  if (board.owner.toString() !== userId && !isCollab) {
    throw new AppError("You do not have access to this board", 403);
  }

  const todos = await Todo.find({ boardId })
    .populate("createdBy", "name")
    .populate("lastModifiedBy", "name")
    .sort({ order: 1, lastModified: -1 });

  return todos.map((t) => mapToDto(t as unknown as ITodoDocument));
};

export const moveTodo = async (
  todoId: string,
  requesterId: string,
  newOrder: number
): Promise<ITodo> => {
  const todo = await Todo.findOne({ todoId }).populate("createdBy", "name");
  if (!todo) throw new AppError("Todo not found", 404);

  const board = await Board.findById(todo.boardId);
  if (!board) throw new AppError("Board not found", 404);

  const isCollab = board.collaborators.some(
    (c) =>
      c.userId.toString() === requesterId &&
      c.role !== "viewer" &&
      c.status === "accepted"
  );
  if (board.owner.toString() !== requesterId && !isCollab) {
    throw new AppError("Permission denied", 403);
  }

  todo.order = newOrder;
  todo.history.push({
    action: "moved",
    performedBy: new mongoose.Types.ObjectId(requesterId),
    timestamp: new Date(),
    details: `Moved to position ${newOrder}`,
  });

  await todo.save();
  return mapToDto(todo as unknown as ITodoDocument);
};

export const getTodoById = async (
  todoId: string,
  userId: string
): Promise<ITodo | null> => {
  const todo = await Todo.findOne({ todoId })
    .populate("createdBy", "name")
    .populate("lastModifiedBy", "name");
  if (!todo) return null;

  const board = await Board.findById(todo.boardId);
  if (!board) return null;

  const hasAccess =
    board.owner.toString() === userId ||
    board.collaborators.some(
      (c) => c.userId.toString() === userId && c.status === "accepted"
    );

  return hasAccess ? mapToDto(todo as unknown as ITodoDocument) : null;
};

export const deleteTodo = async (
  todoId: string,
  userId: string
): Promise<boolean> => {
  const todo = await Todo.findOne({ todoId });
  if (!todo) return false;

  const board = await Board.findById(todo.boardId);
  if (!board) return false;

  const isCollab = board.collaborators.some(
    (c) =>
      c.userId.toString() === userId &&
      c.role !== "viewer" &&
      c.status === "accepted"
  );
  if (board.owner.toString() !== userId && !isCollab) {
    throw new AppError("Permission denied", 403);
  }

  const result = await Todo.deleteOne({ todoId });
  return result.deletedCount > 0;
};
