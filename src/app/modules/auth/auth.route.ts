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

router.post(
  "/change-password",
  authMiddleware(),
  AuthController.changePassword,
);

router.post("/logout", authMiddleware(), AuthController.logoutUser);

export { router as AuthRoutes };
