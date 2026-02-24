import { Request, Response } from "express";
import status from "http-status";

function notFoundHandler(req: Request, res: Response) {
  return res.status(status.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    route: req.originalUrl,
  });
}

export default notFoundHandler;
