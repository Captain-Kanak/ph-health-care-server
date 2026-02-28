import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { env } from "../../config/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";
import ms, { StringValue } from "ms";

const createAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createToken(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: ms(env.ACCESS_TOKEN_EXPIRES_IN as StringValue) / 1000,
  } as SignOptions);

  return accessToken;
};

const createRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: ms(env.REFRESH_TOKEN_EXPIRES_IN as StringValue) / 1000,
  } as SignOptions);

  return refreshToken;
};

const setAccessTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
    maxAge: ms(env.ACCESS_TOKEN_EXPIRES_IN as StringValue),
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
    maxAge: ms(env.REFRESH_TOKEN_EXPIRES_IN as StringValue),
  });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
    maxAge: ms(env.BETTER_AUTH_SESSION_EXPIRES_IN as StringValue),
  });
};

export const tokenUtils = {
  createAccessToken,
  createRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
};
