import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { env } from "../../config/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";

const createAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createToken(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24 * 1,
  } as SignOptions);

  return accessToken;
};

const createRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24 * 7,
  } as SignOptions);

  return refreshToken;
};

const setAccessTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
};

export const tokenUtils = {
  createAccessToken,
  createRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
};
