import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequestBody } from "../../middleware/zod-middleware";
import { AuthValidation } from "./auth.validation";
import authMiddleware from "../../middleware/auth-middleware";

const router: Router = Router();

router.post(
  "/register",
  validateRequestBody(AuthValidation.RegisterPatientSchema),
  AuthController.registerPatient,
);

router.post(
  "/login",
  validateRequestBody(AuthValidation.LoginUserSchema),
  AuthController.loginUser,
);

router.get("/me", authMiddleware(), AuthController.getMe);

router.post("/refresh-tokens", authMiddleware(), AuthController.getNewTokens);

router.post("/logout", authMiddleware(), AuthController.logoutUser);

router.post("/verify-email", AuthController.verifyEmail);

router.post(
  "/change-password",
  authMiddleware(),
  AuthController.changePassword,
);

router.post("/forget-password", AuthController.forgetPassword);

router.post("/reset-password", AuthController.resetPassword);

// http://localhost:5000/api/v1/auth/login/google?redirect=/profile
router.get("/login/google", AuthController.googleLogin);

router.get("/google/success", AuthController.googleLoginSuccess);

router.get("oauth/error", AuthController.googleLoginError);

export { router as AuthRoutes };
