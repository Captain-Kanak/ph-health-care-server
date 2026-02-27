import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { env } from "../../config/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";

const getAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createToken(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: `${Number(env.ACCESS_TOKEN_EXPIRES_IN)}Day`,
  } as SignOptions);

  return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: `${Number(env.REFRESH_TOKEN_EXPIRES_IN)}Days`,
  } as SignOptions);

  return refreshToken;
};

const setAccessTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: Number(env.ACCESS_TOKEN_EXPIRES_IN) * 24 * 60 * 60,
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: Number(env.REFRESH_TOKEN_EXPIRES_IN) * 24 * 60 * 60,
  });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: Number(env.ACCESS_TOKEN_EXPIRES_IN) * 24 * 60 * 60,
  });
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
};
