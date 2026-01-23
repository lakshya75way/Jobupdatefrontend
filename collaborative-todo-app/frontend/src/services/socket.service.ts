import { io, Socket } from "socket.io-client";
import type { ITodo, IBoard } from "../types/common.types";

const SERVER_URL = "http://localhost:5000";
let socketInstance: Socket | null = null;

export const connect = (): Socket | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  if (!socketInstance) {
    socketInstance = io(SERVER_URL, {
      transports: ["websocket"],
      auth: { token },
      autoConnect: false,
    });

    socketInstance.on("connect", () => {
      const boardId = localStorage.getItem("currentBoardId");
      if (boardId) {
        socketInstance?.emit("join-board", boardId);
      }
    });

    socketInstance.on("connect_error", (err) => {
      console.warn("[Socket Error]:", err.message);
    });
  }

  if (!socketInstance.connected) {
    socketInstance.connect();
  }

  return socketInstance;
};

export const joinBoard = (boardId: string): void => {
  if (socketInstance) {
    if (!socketInstance.connected) {
      socketInstance.connect();
    }
    socketInstance.emit("join-board", boardId);
  }
};

export const disconnect = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const syncTodo = (todo: ITodo): void => {
  if (navigator.onLine && socketInstance?.connected) {
    socketInstance.emit("sync-todo", todo);
  }
};

export const deleteTodo = (todoId: string): void => {
  if (navigator.onLine && socketInstance?.connected) {
    socketInstance.emit("delete-todo", todoId);
  }
};

export const onTodoUpdated = (callback: (todo: ITodo) => void): void => {
  socketInstance?.on("todo-updated", callback);
};

export const offTodoUpdated = (): void => {
  socketInstance?.off("todo-updated");
};

export const onTodoDeleted = (callback: (todoId: string) => void): void => {
  socketInstance?.on("todo-deleted", callback);
};

export const offTodoDeleted = (): void => {
  socketInstance?.off("todo-deleted");
};

export const onBoardUpdated = (callback: (board: IBoard) => void): void => {
  socketInstance?.on("board-updated", callback);
};

export const offBoardUpdated = (): void => {
  socketInstance?.off("board-updated");
};

export const onSyncError = (
  callback: (error: { message: string }) => void
): void => {
  socketInstance?.on("sync-error", callback);
};

export const offSyncError = (): void => {
  socketInstance?.off("sync-error");
};

export const offConnect = (): void => {
  socketInstance?.off("connect");
};

export const isConnected = (): boolean => {
  return socketInstance?.connected ?? false;
};

export const removeAllListeners = (): void => {
  if (socketInstance) {
    socketInstance.off("todo-updated");
    socketInstance.off("todo-deleted");
    socketInstance.off("board-updated");
    socketInstance.off("sync-error");
  }
};
