import express, { Application, Request, Response } from "express";
import errorHandler from "./app/middleware/error-handler";
import { IndexRoute } from "./app/routes";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "PH Health Care Server is Running",
  });
});

// API routes
app.use("/api/v1", IndexRoute);

// Route not found handler
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    route: req.originalUrl,
  });
});

// Global error handler
app.use(errorHandler);

export default app;
