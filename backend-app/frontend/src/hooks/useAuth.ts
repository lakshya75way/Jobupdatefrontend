import { useAppSelector, useAppDispatch } from "../store/appStore";
import {
  logout,
  setAuth,
  setLoading,
  setError,
} from "../store/slices/authSlice";
import { useCallback } from "react";
import { User } from "../types/auth";
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth,
  );
  const login = useCallback(
    (userData: User, userToken: string, refreshToken: string) => {
      dispatch(setAuth({ user: userData, token: userToken, refreshToken }));
    },
    [dispatch],
  );
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
  const setAuthLoading = useCallback(
    (isLoading: boolean) => {
      dispatch(setLoading(isLoading));
    },
    [dispatch],
  );
  const setAuthError = useCallback(
    (message: string | null) => {
      dispatch(setError(message));
    },
    [dispatch],
  );
  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout: handleLogout,
    setAuthLoading,
    setAuthError,
  };
};
