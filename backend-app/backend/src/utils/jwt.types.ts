export interface JwtPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
  tokenVersion: number;
}
