import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { env } from "../../config/env";
import status from "http-status";

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (env.NODE_ENV === "development") {
    console.error(err);
  }

  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = err.message || "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
}

export default errorHandler;
