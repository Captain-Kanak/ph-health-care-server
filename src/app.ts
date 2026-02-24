import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import globalErrorHandler from "./app/middleware/error-handler";
import notFoundHandler from "./app/middleware/notFound-handler";
import status from "http-status";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  return res.status(status.OK).json({
    success: true,
    message: "PH Health Care Server is Running",
  });
});

// API routes
app.use("/api/v1", IndexRoutes);

// Route not found handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

export default app;
