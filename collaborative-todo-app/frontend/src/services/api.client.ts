import type { IApiResponse } from "../types/common.types";

const API_BASE_URL = "http://localhost:5000/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

interface RequestOptions {
  method?: HttpMethod;
  body?: object | null;
  headers?: HeadersInit;
}

const getAuthToken = (): string | null => localStorage.getItem("accessToken");

const clearAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<IApiResponse<T>> => {
  const { method = "GET", body, headers: customHeaders, ...rest } = options;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...customHeaders,
  });

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...rest,
    });

    const result = await response.json().catch(() => ({}));

    if (response.status === 401) {
      if (!endpoint.includes("login")) {
        clearAuth();
      }
      return {
        success: false,
        message: result.message || "Unauthorized. Please log in again.",
      };
    }

    if (!response.ok) {
      let errorMessage =
        result.message || `Request failed with status ${response.status}`;

      if (result.error?.issues && Array.isArray(result.error.issues)) {
        errorMessage = result.error.issues
          .map((i: { message: string }) => i.message)
          .join(". ");
      } else if (result.errors && Array.isArray(result.errors)) {
        errorMessage = result.errors
          .map((e: { message: string }) => e.message)
          .join(". ");
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    return {
      success: result.status === "success",
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    console.error(`[API Client Error] ${method} ${endpoint}:`, error);
    return {
      success: false,
      message: "A network error occurred. Please check your connection.",
    };
  }
};
