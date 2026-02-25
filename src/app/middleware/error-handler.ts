import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { env } from "../../config/env";
import status from "http-status";
import * as z from "zod";

interface ErrorSourceType {
  path: string;
  message: string;
}

function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (env.NODE_ENV === "development") {
    console.error(err);
  }

  const errorSource: ErrorSourceType[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = err.message || "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err instanceof z.ZodError) {
    statusCode = status.BAD_REQUEST;
    message = "Zod Validation Error";

    err.issues.forEach((issue) => {
      errorSource.push({
        path: issue.path.join("."),
        message: issue.message,
      });
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

export default globalErrorHandler;
