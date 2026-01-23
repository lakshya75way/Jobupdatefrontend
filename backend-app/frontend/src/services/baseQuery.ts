import { AxiosRequestConfig, AxiosError } from "axios";
import api from "./api";
export const baseQuery = async (args: string | AxiosRequestConfig) => {
  try {
    const config = typeof args === "string" ? { url: args } : args;
    const result = await api(config);
    return { data: result.data };
  } catch (axiosError: unknown) {
    const err = axiosError as AxiosError<{ message?: string }>;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || { message: err.message },
      },
    };
  }
};
