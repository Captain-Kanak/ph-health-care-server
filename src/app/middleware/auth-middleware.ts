import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie";
import AppError from "../utils/AppError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { env } from "../../config/env";

const authMiddleware =
  (...roles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = cookieUtils.getCookie(req, "refreshToken");
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!refreshToken) {
        throw new AppError("Unauthorized", status.UNAUTHORIZED);
      }

      if (!sessionToken) {
        throw new AppError("Unauthorized", status.UNAUTHORIZED);
      }

      if (!accessToken) {
        throw new AppError("Unauthorized", status.UNAUTHORIZED);
      }

      const isAccessTokenValid = jwtUtils.verifyToken(
        accessToken,
        env.ACCESS_TOKEN_SECRET,
      );

      const isRefreshTokenValid = jwtUtils.verifyToken(
        refreshToken,
        env.REFRESH_TOKEN_SECRET,
      );

      if (!isAccessTokenValid) {
        throw new AppError("Unauthorized", status.UNAUTHORIZED);
      }

      if (!isRefreshTokenValid) {
        throw new AppError("Unauthorized", status.UNAUTHORIZED);
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default authMiddleware;
