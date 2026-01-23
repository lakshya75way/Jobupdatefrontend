export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}
export interface RegisterResponse {
  message: string;
  user?: User;
}
