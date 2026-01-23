import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util.js";
import { AppError } from "./error.middleware.js";
import User from "../models/user.model.js";
import { catchAsync } from "./error.middleware.js";

export const protect = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log(`[Auth] No token provided for ${req.method} ${req.path}`);
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (!user) {
        console.log(`[Auth] User not found for token: ${decoded.userId}`);
        return next(
          new AppError(
            "The user belonging to this token no longer exists.",
            401
          )
        );
      }

      if (decoded.tokenVersion !== user.tokenVersion) {
        console.log(`[Auth] Token version mismatch for user: ${user.email}`);
        return next(
          new AppError(
            "User recently changed password! Please log in again.",
            401
          )
        );
      }

      console.log(
        `[Auth] ${user.email} authenticated for ${req.method} ${req.path}`
      );
      req.user = decoded;
      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "TokenExpiredError") {
          return next(
            new AppError("Your token has expired! Please log in again.", 401)
          );
        }
        if (error.name === "JsonWebTokenError") {
          return next(new AppError("Invalid token. Please log in again.", 401));
        }
      }
      next(error);
    }
  }
);

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
