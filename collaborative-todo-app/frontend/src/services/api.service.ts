import { apiClient } from "./api.client";
import type { ITodo, IApiResponse, IBoard } from "../types/common.types";

export const verifyEmail = (token: string): Promise<IApiResponse<void>> =>
  apiClient<void>(`/auth/verify/${token}`, { method: "POST" });

export const forgotPassword = (email: string): Promise<IApiResponse<void>> =>
  apiClient<void>("/auth/forgot-password", { method: "POST", body: { email } });

export const resetPassword = (
  token: string,
  password: string
): Promise<IApiResponse<void>> =>
  apiClient<void>(`/auth/reset-password/${token}`, {
    method: "POST",
    body: { password },
  });

export const getBoards = (): Promise<IApiResponse<{ boards: IBoard[] }>> =>
  apiClient<{ boards: IBoard[] }>("/boards");

export const getPendingInvites = (): Promise<
  IApiResponse<{ boards: IBoard[] }>
> => apiClient<{ boards: IBoard[] }>("/boards/invites");

export const createBoard = (
  name: string
): Promise<IApiResponse<{ board: IBoard }>> =>
  apiClient<{ board: IBoard }>("/boards", { method: "POST", body: { name } });

export const inviteToBoard = (
  boardId: string,
  email: string,
  role: string
): Promise<IApiResponse<{ board: IBoard }>> =>
  apiClient<{ board: IBoard }>(`/boards/${boardId}/invite`, {
    method: "POST",
    body: { email, role },
  });

export const acceptInvite = (boardId: string): Promise<IApiResponse<void>> =>
  apiClient<void>(`/boards/${boardId}/accept`, { method: "POST" });

export const removeCollaborator = (
  boardId: string,
  userId: string
): Promise<IApiResponse<{ board: IBoard }>> =>
  apiClient<{ board: IBoard }>(`/boards/${boardId}/collaborators/${userId}`, {
    method: "DELETE",
  });

export const updateCollaboratorRole = (
  boardId: string,
  userId: string,
  role: string
): Promise<IApiResponse<{ board: IBoard }>> =>
  apiClient<{ board: IBoard }>(`/boards/${boardId}/collaborators/${userId}`, {
    method: "PATCH",
    body: { role },
  });

export const getBoardTodos = (
  boardId: string
): Promise<IApiResponse<{ todos: ITodo[] }>> =>
  apiClient<{ todos: ITodo[] }>(`/todos?boardId=${boardId}`);

export const deleteTodo = (id: string): Promise<IApiResponse<void>> =>
  apiClient<void>(`/todos/${id}`, { method: "DELETE" });

export const moveTodo = (
  todoId: string,
  newOrder: number
): Promise<IApiResponse<{ todo: ITodo }>> =>
  apiClient<{ todo: ITodo }>(`/todos/${todoId}/move`, {
    method: "PATCH",
    body: { newOrder },
  });
