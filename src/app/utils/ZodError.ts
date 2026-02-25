import status from "http-status";
import * as z from "zod";
import {
  ErrorResponseType,
  ErrorSourceType,
} from "../../interfaces/error.interface";

export const handleZodError = (err: z.ZodError): ErrorResponseType => {
  const statusCode: number = status.BAD_REQUEST;
  const message: string = "Zod Validation Error";
  const errorSources: ErrorSourceType[] = [];

  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join("."),
      message: issue.message,
    });
  });

  return {
    statusCode,
    message,
    errorSources,
  };
};
