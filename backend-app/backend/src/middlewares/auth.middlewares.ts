import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "./error.middleware";
import { User } from "../models/user.model";
export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError("Invalid or missing token", 401));
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    if (decoded.tokenVersion !== user.tokenVersion) {
      return next(new AppError("Please login again session expired", 401));
    }
    req.user = decoded;
    next();
  } catch {
    return next(new AppError("Invalid token", 401));
  }
};
export const authorize = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
