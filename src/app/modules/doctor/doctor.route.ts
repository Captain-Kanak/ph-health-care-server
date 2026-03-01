import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import {
  validateParams,
  validateRequestBody,
} from "../../middleware/zod-middleware";
import { ParamsIdZodSchema } from "../../validation/params.validation";
import authMiddleware from "../../middleware/auth-middleware";
import { UserRole } from "@prisma/client";
import { DoctorValidation } from "./doctor.validation";

const router: Router = Router();

router.get("/", DoctorController.getAllDoctors);

router.get(
  "/:id",
  validateParams(ParamsIdZodSchema),
  DoctorController.getDoctorById,
);

router.patch(
  "/:id",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  validateParams(ParamsIdZodSchema),
  validateRequestBody(DoctorValidation.UpdateDoctorZodSchema),
  DoctorController.updateDoctorById,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  validateParams(ParamsIdZodSchema),
  DoctorController.deleteDoctorById,
);

export { router as DoctorRoutes };
