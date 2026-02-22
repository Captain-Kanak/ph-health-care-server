import type { Application, Request, Response } from "express";
import express from "express";

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

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    route: req.originalUrl,
  });
});

export default app;
