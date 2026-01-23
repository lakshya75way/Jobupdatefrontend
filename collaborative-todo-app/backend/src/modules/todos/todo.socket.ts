import { Server, Socket } from "socket.io";
import * as todoService from "./todo.service.js";
import type { ITodo } from "../../types/app.types.js";
import { verifyToken } from "../../utils/jwt.util.js";

interface IAuthenticatedSocket extends Socket {
  userId?: string;
  boardId?: string;
}

export const setupSocketHandlers = (io: Server): void => {
  io.use((socket: IAuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.log(`[Socket] Connection rejected: No token`);
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = verifyToken(token);
      socket.userId = decoded.userId;
      console.log(`[Socket] Socket authenticated: User ${decoded.userId}`);
      next();
    } catch (error) {
      console.log(`[Socket] Authentication failed: Invalid token`);
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: IAuthenticatedSocket) => {
    socket.on("join-board", (boardId: string = "main-board") => {
      socket.boardId = boardId;
      socket.join(boardId);
    });

    socket.on("sync-todo", async (todoData: ITodo) => {
      if (!socket.userId || !socket.boardId) {
        socket.emit("sync-error", {
          message: "Not authenticated or board not joined",
        });
        return;
      }

      try {
        const syncedTodo = await todoService.syncTodo(
          todoData,
          socket.userId,
          socket.boardId
        );

        if (syncedTodo) {
          socket.to(socket.boardId).emit("todo-updated", syncedTodo);
        }
      } catch (error: unknown) {
        socket.emit("sync-error", {
          message: error instanceof Error ? error.message : "Sync failed",
        });
      }
    });

    socket.on("delete-todo", async (todoId: string) => {
      if (!socket.userId || !socket.boardId) {
        socket.emit("sync-error", {
          message: "Not authenticated or board not joined",
        });
        return;
      }

      try {
        const success = await todoService.deleteTodo(todoId, socket.userId);

        if (success) {
          socket.to(socket.boardId).emit("todo-deleted", todoId);
        }
      } catch (error: unknown) {
        socket.emit("sync-error", {
          message: error instanceof Error ? error.message : "Delete failed",
        });
      }
    });

    socket.on("disconnect", () => {});
  });
};
