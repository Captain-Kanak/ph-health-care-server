import type { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { env } from "../../config/env";
import status from "http-status";
import * as z from "zod";
import { ErrorSourceType } from "../../interfaces/error.interface";
import { handleZodError } from "../errors/ZodError";
import { deleteFromCloudinary } from "../../config/cloudinary.config";

async function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (env.NODE_ENV === "development") {
    console.error(err);
  }

  if (req.file) {
    await deleteFromCloudinary(req.file.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files.map((file) => file.path);

    await Promise.all(imageUrls.map((url) => deleteFromCloudinary(url)));
  }

  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let errorSources: ErrorSourceType[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err instanceof z.ZodError) {
    const simplifiedZodErrors = handleZodError(err);

    statusCode = simplifiedZodErrors.statusCode;
    message = simplifiedZodErrors.message;
    errorSources = [...simplifiedZodErrors.errorSources];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

export default globalErrorHandler;
