import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "./jwt.types";

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload as object, env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload as object, env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
