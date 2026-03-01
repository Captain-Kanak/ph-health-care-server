import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import {
  validateParams,
  validateRequestBody,
} from "../../middleware/zod-middleware";
import { ParamsIdZodSchema } from "../../validation/params.validation";
import { UpdateDoctorZodSchema } from "../../validation/doctor.zod";
import authMiddleware from "../../middleware/auth-middleware";
import { UserRole } from "@prisma/client";

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
  validateRequestBody(UpdateDoctorZodSchema),
  DoctorController.updateDoctorById,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  validateParams(ParamsIdZodSchema),
  DoctorController.deleteDoctorById,
);

export { router as DoctorRoutes };
