import { Router } from "express";
import { UserController } from "./user.controller";
import { createDoctorZodSchema } from "../../validation/doctor.zod";
import { validateRequestBody } from "../../middleware/zod-middleware";
import authMiddleware from "../../middleware/auth-middleware";
import { UserRole } from "@prisma/client";

const router: Router = Router();

router.post(
  "/create-doctor",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequestBody(createDoctorZodSchema),
  UserController.createDoctor,
);

export { router as UserRoutes };
