import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequestBody } from "../../middleware/zod-middleware";
import { AuthValidation } from "./auth.validation";

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

router.get("/get-me", AuthController.getMe);

export { router as AuthRoutes };
