import { useState, useEffect, useCallback } from "react";
import * as todoService from "./todo.service";
import * as socketService from "../../services/socket.service";
import type { ITodo } from "../../types/common.types";

export const useTodos = (boardId: string | null) => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);

  const loadTodos = useCallback(async () => {
    if (!boardId) {
      setTodos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const allTodos = await todoService.getBoardTodos(boardId);
      setTodos(allTodos);
    } catch (error) {
      console.error("[useTodos] Failed to load todos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    const socket = socketService.connect();

    if (socket) {
      if (socket.connected) {
        todoService.syncAllTodos();
        loadTodos();
      } else {
        socket.once("connect", () => {
          todoService.syncAllTodos();
          loadTodos();
        });
      }
    }
  }, [loadTodos]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  const handleRemoteTodoUpdate = useCallback(
    async (remoteTodo: ITodo) => {
      if (remoteTodo.boardId !== boardId) {
        return;
      }

      const updated = await todoService.handleRemoteTodoUpdate(remoteTodo);
      if (updated) {
        const currentTodos = await todoService.getBoardTodos(boardId);
        setTodos(currentTodos);
      }
    },
    [boardId]
  );

  useEffect(() => {
    loadTodos();
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [loadTodos, handleOnline, handleOffline]);

  useEffect(() => {
    if (!boardId || !isOnline) return;

    const socket = socketService.connect();
    if (socket) {
      socketService.joinBoard(boardId);
      socketService.onTodoUpdated(handleRemoteTodoUpdate);
      socketService.onTodoDeleted((todoId) => {
        todoService.handleRemoteDelete(todoId);
        setTodos((prev) => prev.filter((t) => t.id !== todoId));
      });

      const handleRejoin = () => {
        socketService.joinBoard(boardId);
        loadTodos();
      };
      socket.on("connect", handleRejoin);

      return () => {
        socket.off("connect", handleRejoin);
        socketService.offTodoUpdated();
        socketService.offTodoDeleted();
      };
    }
  }, [boardId, isOnline, handleRemoteTodoUpdate]);

  const addTodo = async (text: string, description?: string): Promise<void> => {
    if (!boardId) return;
    try {
      const newTodo = await todoService.createTodo(text, boardId, description);
      setTodos((prev) => [...prev, newTodo].sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("[useTodos] Failed to add todo:", error);
    }
  };

  const toggleTodo = async (id: string): Promise<void> => {
    try {
      const updated = await todoService.toggleTodo(id);
      if (updated) {
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      }
    } catch (error) {
      console.error("[useTodos] Failed to toggle todo:", error);
    }
  };

  const deleteTodo = async (id: string): Promise<void> => {
    try {
      await todoService.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("[useTodos] Failed to delete todo:", error);
    }
  };

  const updateTodoText = async (
    id: string,
    updates: { text?: string; description?: string }
  ): Promise<void> => {
    try {
      const updated = await todoService.updateTodo(id, updates);
      if (updated) {
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      }
    } catch (error) {
      console.error("[useTodos] Failed to update todo:", error);
    }
  };

  const moveTodo = async (id: string, direction: "up" | "down") => {
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === todos.length - 1) return;

    const todo = todos[index];
    let newOrder = todo.order;

    if (direction === "up") {
      const prev = todos[index - 1];
      const prevPrev = todos[index - 2];
      const upperInfo = prevPrev ? prevPrev.order : prev.order - 100000;
      newOrder = (prev.order + upperInfo) / 2;
    } else {
      const next = todos[index + 1];
      const nextNext = todos[index + 2];
      const lowerInfo = nextNext ? nextNext.order : next.order + 100000;
      newOrder = (next.order + lowerInfo) / 2;
    }

    const updatedTodo = { ...todo, order: newOrder };
    setTodos((prev) =>
      prev
        .map((t) => (t.id === id ? updatedTodo : t))
        .sort((a, b) => a.order - b.order)
    );

    try {
      await todoService.moveTodo(id, newOrder);
    } catch (e) {
      await loadTodos();
    }
  };

  return {
    todos,
    isOnline,
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoText,
    moveTodo,
    refresh: loadTodos,
  };
};
