import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { User } from "@prisma/client";
import { cookieUtils } from "../../utils/cookie";
import { env } from "../../../config/env";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthService.registerPatient(payload);
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Patient registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthService.loginUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Patient logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await AuthService.getMe(user as User);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

const getNewTokens = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = cookieUtils.getCookie(req, "refreshToken");
  const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");

  const result = await AuthService.getNewTokens(refreshToken, sessionToken);
  const { accessToken, refreshToken: newRefreshToken, token } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tokens fetched successfully",
    data: result,
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");

  const result = await AuthService.logoutUser(sessionToken);

  cookieUtils.clearCookie(res, "accessToken", {});
  cookieUtils.clearCookie(res, "refreshToken", {});
  cookieUtils.clearCookie(res, "better-auth.session_token", {});

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User logged out successfully",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  await AuthService.verifyEmail(email, otp);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Email verified successfully",
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");

  const result = await AuthService.changePassword(payload, sessionToken);
  const { accessToken, refreshToken, token } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  await AuthService.forgetPassword(email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password reset email sent successfully",
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;

  await AuthService.resetPassword(email, otp, password);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password reset successfully",
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath as string);
  const callbackURL = `${env.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

  return res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: env.BETTER_AUTH_URL,
  });
});

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = (req.query.redirect as string) || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];

  if (!sessionToken) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=oauth_failed`);
  }

  const result = await AuthService.googleLoginSuccess(sessionToken);
  const { session, user, accessToken, refreshToken } = result;

  if (!session) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=no_session_found`);
  }

  if (!user) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=no_user_found`);
  }

  if (!accessToken || !refreshToken) {
    return res.redirect(`${env.FRONTEND_URL}/login?error=no_tokens_found`);
  }

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);

  const isValidRedirectPath =
    redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

  return res.redirect(`${env.FRONTEND_URL}${finalRedirectPath}?auth=success`);
});

const googleLoginError = catchAsync(async (req: Request, res: Response) => {
  const error = (req.query.error as string) || "oauth_failed";

  return res.redirect(`${env.FRONTEND_URL}/login?error=${error}`);
});

export const AuthController = {
  registerPatient,
  loginUser,
  getMe,
  getNewTokens,
  logoutUser,
  verifyEmail,
  changePassword,
  forgetPassword,
  resetPassword,
  googleLogin,
  googleLoginSuccess,
  googleLoginError,
};
