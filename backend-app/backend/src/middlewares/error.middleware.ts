import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
export interface ValidationError {
  field: string;
  message: string;
}
interface MongoDBCastError extends Error {
  path: string;
  value: unknown;
  name: "CastError";
}
interface MongoDBDuplicateError extends Error {
  code: 11000;
  keyValue: Record<string, unknown>;
}
export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public errors?: ValidationError[];
  constructor(message: string, statusCode: number, errors?: ValidationError[]) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    if (errors) this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
const handleZodError = (err: ZodError): AppError => {
  const errors: ValidationError[] = err.issues.map((issue) => ({
    field: issue.path.join("."),
    message:
      issue.message === "Required" ? "Required field missing" : issue.message,
  }));
  return new AppError("Validation failed", 400, errors);
};
const handleCastErrorDB = (err: MongoDBCastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err: MongoDBDuplicateError): AppError => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${
    field.charAt(0).toUpperCase() + field.slice(1)
  } "${value}" is already in use.`;
  return new AppError(message, 400);
};
const sendErrorDev = (err: AppError, res: Response) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  } else {
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};
export const globalErrorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
    error.message = err.message;
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err instanceof ZodError) error = handleZodError(err);
    if (error.name === "JsonWebTokenError")
      error = new AppError("Invalid token.", 401);
    if (error.name === "TokenExpiredError")
      error = new AppError("Token expired.", 401);
    if (!(error instanceof AppError)) {
      error = new AppError(
        err.message || "Server Error",
        err.statusCode || 500,
      );
      error.isOperational = false;
    }
    sendErrorProd(error, res);
  }
};
