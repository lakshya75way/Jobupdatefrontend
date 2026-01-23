import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { setUser, setLoading } from "../store/slices/authSlice";
import { jwtDecode } from "jwt-decode";
interface JwtPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
  tokenVersion: number;
}
export const useRestoreSession = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        dispatch(setLoading(true));
        const decoded = jwtDecode<JwtPayload>(token);
        dispatch(
          setUser({
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
          }),
        );
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        dispatch(setLoading(false));
      }
    }
  }, [dispatch]);
};
