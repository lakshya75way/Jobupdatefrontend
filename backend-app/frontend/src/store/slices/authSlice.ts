import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../../types/auth";
import { storageService, StorageKey } from "../../services/storage.service";

const token = storageService.getAccessToken();

const initialState: AuthState = {
  user: null,
  token: token,
  isAuthenticated: !!token,
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
      storageService.setItem(StorageKey.ACCESS_TOKEN, action.payload.token);
      storageService.setItem(
        StorageKey.REFRESH_TOKEN,
        action.payload.refreshToken,
      );
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
      storageService.clear();
    },
  },
});

export const { setLoading, setUser, setAuth, setError, logout } =
  authSlice.actions;
export default authSlice.reducer;
