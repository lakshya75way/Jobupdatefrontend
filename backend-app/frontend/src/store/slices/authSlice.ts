import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../../types/auth";
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setAuth: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem("accessToken", action.payload.token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});
export const { setLoading, setUser, setAuth, setError, logout } =
  authSlice.actions;
export default authSlice.reducer;
