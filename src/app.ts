import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import globalErrorHandler from "./app/middleware/error-handler";
import notFoundHandler from "./app/middleware/notFound-handler";
import status from "http-status";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  return res.status(status.OK).json({
    success: true,
    message: "PH Health Care Server is Running",
  });
});

app.use("/api/v1", IndexRoutes);

app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;
