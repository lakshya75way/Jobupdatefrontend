import jwt from "jsonwebtoken";
import { config } from "../config/env.config.js";

export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
  tokenVersion: number;
}

export const generateToken = (payload: IJwtPayload): string => {
  return jwt.sign(
    payload,
    config.jwtSecret as jwt.Secret,
    {
      expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.jwtSecret) as IJwtPayload;
};

export const generateRefreshToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "7d",
  });
};
