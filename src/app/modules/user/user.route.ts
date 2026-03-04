import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequestBody } from "../../middleware/zod-middleware";
import authMiddleware from "../../middleware/auth-middleware";
import { UserRole } from "@prisma/client";
import { UserValidation } from "./user.validation";

const router: Router = Router();

router.post(
  "/create-admin",
  authMiddleware(UserRole.SUPER_ADMIN),
  validateRequestBody(UserValidation.CreateAdminValidationSchema),
  UserController.createAdmin,
);

router.post(
  "/create-doctor",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequestBody(UserValidation.CreateDoctorZodSchema),
  UserController.createDoctor,
);

export { router as UserRoutes };
