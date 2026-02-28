import { UserRole, UserStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie";
import AppError from "../errors/AppError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { env } from "../../config/env";
import { prisma } from "../lib/prisma";

const authMiddleware =
  (...roles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // better auth session token verification
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new AppError(
          "Unauthorized: You don't have permission to access this resource",
          status.UNAUTHORIZED,
        );
      }

      if (sessionToken) {
        const session = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (!session) {
          throw new AppError(
            "Unauthorized: You don't have permission to access this resource",
            status.UNAUTHORIZED,
          );
        }

        if (session && session.user) {
          const user = session.user;

          const now = new Date();
          const expiresAt = new Date(session.expiresAt);
          const createdAt = new Date(session.createdAt);
          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const parcentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (parcentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Session-Time-Remaining", timeRemaining.toString());

            console.log("Session is about to expire");
          }

          if (user.status !== UserStatus.ACTIVE || user.isDeleted) {
            throw new AppError(
              "Unauthorized: User is blocked or deleted. You don't have permission to access this resource",
              status.UNAUTHORIZED,
            );
          }

          if (roles.length > 0 && !roles.includes(user.role)) {
            throw new AppError(
              "Forbidden: You don't have permission to access this resource",
              status.FORBIDDEN,
            );
          }
        }
      }

      // access token verification
      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          "Unauthorized: You don't have permission to access this resource",
          status.UNAUTHORIZED,
        );
      }

      if (accessToken) {
        const isAccessTokenValid = jwtUtils.verifyToken(
          accessToken,
          env.ACCESS_TOKEN_SECRET,
        );

        if (!isAccessTokenValid) {
          throw new AppError(
            "Unauthorized: Invalid access token",
            status.UNAUTHORIZED,
          );
        }

        if (roles.length > 0 && !roles.includes(isAccessTokenValid.role)) {
          throw new AppError(
            "Forbidden: You don't have permission to access this resource",
            status.FORBIDDEN,
          );
        }
      }

      // refresh token verification
      const refreshToken = cookieUtils.getCookie(req, "refreshToken");

      if (!refreshToken) {
        throw new AppError(
          "Unauthorized: You don't have permission to access this resource",
          status.UNAUTHORIZED,
        );
      }

      if (refreshToken) {
        const isRefreshTokenValid = jwtUtils.verifyToken(
          refreshToken,
          env.REFRESH_TOKEN_SECRET,
        );

        if (!isRefreshTokenValid) {
          throw new AppError(
            "Unauthorized: Invalid refresh token",
            status.UNAUTHORIZED,
          );
        }

        if (roles.length > 0 && !roles.includes(isRefreshTokenValid.role)) {
          throw new AppError(
            "Forbidden: You don't have permission to access this resource",
            status.FORBIDDEN,
          );
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default authMiddleware;
