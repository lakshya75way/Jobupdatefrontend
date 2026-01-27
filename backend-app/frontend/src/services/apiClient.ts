import axios from "axios";
import { store } from "../store/appStore";
import { logout } from "../store/slices/authSlice";
import { env } from "../config/env.config";
import { socketClient } from "./socketClient";
import { storageService, StorageKey } from "./storage.service";

const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = storageService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      const isLoginPage = window.location.pathname.includes("/login");
      const isSignupPage = window.location.pathname.includes("/signup");
      if (isLoginPage || isSignupPage) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      try {
        const refreshToken = storageService.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token");
        }
        const response = await axios.post<{ accessToken: string }>(
          `${env.VITE_API_URL}/auth/refresh-token`,
          { refreshToken },
        );
        const { accessToken } = response.data;
        storageService.setItem(StorageKey.ACCESS_TOKEN, accessToken);
        socketClient.refreshAuth();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError: unknown) {
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
export default api;
