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

      if (!refreshToken) {
        throw new AppError("Unauthorized", status.UNAUTHORIZED);
      }

      console.log({ refreshToken });

      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new AppError("Unauthorized", status.UNAUTHORIZED);
      }

      console.log({ sessionToken });

      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError("Unauthorized", status.UNAUTHORIZED);
      }

      const verifiedAccessToken = jwtUtils.verifyToken(
        accessToken,
        env.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedAccessToken.success) {
        throw new AppError("Unauthorized", status.UNAUTHORIZED);
      }

      console.log({ accessToken, verifiedAccessToken });

      next();
    } catch (error) {
      next(error);
    }
  };

export default authMiddleware;
