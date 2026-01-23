import { apiClient } from "./api.client";
import { db } from "./database.service";
import * as socketService from "./socket.service";
import type {
  ILoginData,
  ISignupData,
  IAuthResponse,
  IUser,
} from "../types/auth.types";

export const getToken = (): string | null =>
  localStorage.getItem("accessToken");

export const setTokens = (token: string, refreshToken?: string): void => {
  localStorage.setItem("accessToken", token);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const removeTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("currentBoardId");
};

export const setUser = (user: IUser): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = (): IUser | null => {
  const user = localStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const signup = async (data: ISignupData): Promise<IAuthResponse> => {
  const response = await apiClient<IAuthResponse["data"]>("/auth/signup", {
    method: "POST",
    body: data,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message || "Signup failed");
  }

  return { status: "success", data: response.data };
};

export const login = async (data: ILoginData): Promise<IAuthResponse> => {
  const response = await apiClient<IAuthResponse["data"]>("/auth/login", {
    method: "POST",
    body: data,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message || "Login failed");
  }

  setTokens(response.data.token, response.data.refreshToken);
  setUser(response.data.user);

  return { status: "success", data: response.data };
};

export const logout = async (): Promise<void> => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    socketService.disconnect();
    await apiClient("/auth/logout", {
      method: "POST",
      body: { refreshToken },
    });
  } catch (error) {
    console.error("Logout request failed:", error);
  }

  try {
    await db.todos.clear();
  } catch (e) {
    console.error("Failed to clear local DB:", e);
  } finally {
    removeTokens();
    window.location.href = "/login";
  }
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await apiClient("/auth/change-password", {
    method: "POST",
    body: { oldPassword, newPassword },
  });

  return {
    success: response.success,
    message: response.message,
  };
};

export const isAuthenticated = (): boolean => !!getToken();
