import axios, { AxiosError } from "axios";
import { notificationService } from "../services/notificationService";

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: unknown;
}

export const handleApiError = (
  error: unknown,
  defaultMessage = "Something went wrong",
) => {
  let errorMessage = defaultMessage;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      defaultMessage;

    if (import.meta.env.DEV) {
      console.error("[API Error]:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        config: axiosError.config,
      });
    }

    if (axiosError.response?.status === 401) {
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  notificationService.message.error(errorMessage);
  return errorMessage;
};
