import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "./jwt.types";
if (!env.jwtSecret) {
  throw new Error("JWT");
}
export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload as object,
    env.jwtSecret,
    {
      expiresIn: "7d",
    }
  );
};
export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload as object,
    env.jwtSecret,
    {
      expiresIn: "15m",
    }
  );
};
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(
    token,
    env.jwtSecret
  ) as JwtPayload
};