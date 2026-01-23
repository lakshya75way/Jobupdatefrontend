import { Navigate, Outlet } from "react-router-dom";
import * as authService from "../services/auth.service";


export const ProtectedRoute = () => {
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
