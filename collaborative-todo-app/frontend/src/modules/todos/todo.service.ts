import * as todoRepository from "./todo.repository";
import * as socketService from "../../services/socket.service";
import * as apiService from "../../services/api.service";
import type { ITodo } from "../../types/common.types";


const getOrCreateClientId = (): string => {
  let clientId = localStorage.getItem("clientId");
  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem("clientId", clientId);
  }
  return clientId;
};

const clientId = getOrCreateClientId();


export const getBoardTodos = async (boardId: string): Promise<ITodo[]> => {
  const localTodos = await todoRepository.getByBoardId(boardId);

  if (navigator.onLine) {
    try {
      const response = await apiService.getBoardTodos(boardId);
      if (response.success && response.data?.todos) {
        await Promise.all(
          response.data.todos.map((todo) => todoRepository.syncWithRemote(todo))
        );
        return await todoRepository.getByBoardId(boardId);
      }
    } catch (error) {
      console.error("[TodoService] Failed to fetch remote todos:", error);
    }
  }

  return localTodos;
};


export const createTodo = async (
  text: string,
  boardId: string,
  description?: string
): Promise<ITodo> => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const newTodo: ITodo = {
    id: crypto.randomUUID(),
    text,
    description,
    completed: false,
    version: 0,
    lastModified: Date.now(),
    clientId,
    boardId,
    order: Date.now(),
    metadata: {},
    history: [
      {
        action: "created",
        performedBy: user._id || "me",
        timestamp: new Date(),
      },
    ],
    createdBy: user._id || "me",
    createdByName: user.name || "Me",
  };

  await todoRepository.create(newTodo);

  if (socketService.isConnected()) {
    socketService.syncTodo(newTodo);
  }

  return newTodo;
};


export const moveTodo = async (
  todoId: string,
  newOrder: number
): Promise<void> => {
  const todo = await todoRepository.getById(todoId);
  if (!todo) return;

  const updatedTodo: ITodo = {
    ...todo,
    order: newOrder,
    version: todo.version + 1,
    lastModified: Date.now(),
  };

  await todoRepository.update(updatedTodo);
  if (socketService.isConnected()) {
    socketService.syncTodo(updatedTodo);
  }
};


export const toggleTodo = async (id: string): Promise<ITodo | null> => {
  const todo = await todoRepository.getById(id);
  if (!todo) return null;

  const updatedTodo: ITodo = {
    ...todo,
    completed: !todo.completed,
    version: todo.version + 1,
    lastModified: Date.now(),
  };

  await todoRepository.update(updatedTodo);

  if (socketService.isConnected()) {
    socketService.syncTodo(updatedTodo);
  }

  return updatedTodo;
};


export const updateTodo = async (
  id: string,
  updates: { text?: string; description?: string }
): Promise<ITodo | null> => {
  const todo = await todoRepository.getById(id);
  if (!todo) return null;

  const updatedTodo: ITodo = {
    ...todo,
    ...updates,
    version: todo.version + 1,
    lastModified: Date.now(),
  };

  await todoRepository.update(updatedTodo);

  if (socketService.isConnected()) {
    socketService.syncTodo(updatedTodo);
  }

  return updatedTodo;
};


export const deleteTodo = async (id: string): Promise<void> => {
  await todoRepository.deleteTodo(id);
  if (socketService.isConnected()) {
    socketService.deleteTodo(id);
  }
};

export const handleRemoteDelete = async (id: string): Promise<void> => {
  await todoRepository.deleteTodo(id);
};


export const syncAllTodos = async (): Promise<void> => {
  const todos = await todoRepository.getAll();
  todos.forEach((todo) => {
    socketService.syncTodo(todo);
  });
};


export const handleRemoteTodoUpdate = async (
  remoteTodo: ITodo
): Promise<boolean> => {
  return await todoRepository.syncWithRemote(remoteTodo);
};
