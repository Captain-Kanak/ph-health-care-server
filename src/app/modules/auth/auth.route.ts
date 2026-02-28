import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequestBody } from "../../middleware/zod-middleware";
import {
  LoginUserSchema,
  RegisterPatientSchema,
} from "../../validation/auth.zod";

const router: Router = Router();

router.post(
  "/register",
  validateRequestBody(RegisterPatientSchema),
  AuthController.registerPatient,
);

router.post(
  "/login",
  validateRequestBody(LoginUserSchema),
  AuthController.loginUser,
);

export { router as AuthRoutes };
