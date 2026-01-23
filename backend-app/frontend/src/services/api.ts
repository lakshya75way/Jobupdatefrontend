import axios from "axios";
import { store } from "../store";
import { logout } from "../store/slices/authSlice";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
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
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }
        const response = await axios.post<{ accessToken: string }>(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth/refresh-token`,
          { refreshToken },
        );
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
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
