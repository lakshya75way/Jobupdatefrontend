import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { IValidationError } from "../types/app.types.js";


export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public errors?: IValidationError[];

  constructor(
    message: string,
    statusCode: number,
    errors?: IValidationError[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    if (errors) this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}


export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};

const handleZodError = (err: ZodError): AppError => {
  const errors: IValidationError[] = err.issues.map((issue) => ({
    field: issue.path.join("."),
    message:
      issue.message === "Required" ? "Required field missing" : issue.message,
  }));

  return new AppError("Validation failed", 400, errors);
};

const handleCastErrorDB = (err: { path: string; value: string }): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: {
  keyValue: Record<string, string>;
}): AppError => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${
    field.charAt(0).toUpperCase() + field.slice(1)
  } "${value}" is already in use.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: AppError, res: Response): void => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};


export const globalErrorHandler = (
  err: Error & {
    statusCode?: number;
    status?: string;
    code?: number;
    name: string;
    path?: string;
    value?: string;
    keyValue?: Record<string, string>;
  },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err as AppError, res);
  } else {
    let error: AppError;

    if (err instanceof ZodError) {
      error = handleZodError(err);
    } else if (err.name === "CastError") {
      error = handleCastErrorDB({ path: err.path!, value: err.value! });
    } else if (err.code === 11000) {
      error = handleDuplicateFieldsDB({ keyValue: err.keyValue! });
    } else if (err.name === "JsonWebTokenError") {
      error = new AppError("Invalid token.", 401);
    } else if (err.name === "TokenExpiredError") {
      error = new AppError("Token expired.", 401);
    } else if (err instanceof AppError) {
      error = err;
    } else {
      error = new AppError(
        err.message || "Server Error",
        err.statusCode || 500
      );
      error.isOperational = false;
    }

    sendErrorProd(error, res);
  }
};
