import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import {
  validateParams,
  validateRequestBody,
} from "../../middleware/zod-middleware";
import { paramsIdZodSchema } from "../../validation/params.zod";
import { UpdateDoctorZodSchema } from "../../validation/doctor.zod";
import authMiddleware from "../../middleware/auth-middleware";
import { UserRole } from "@prisma/client";

const router: Router = Router();

router.get("/", DoctorController.getAllDoctors);

router.get(
  "/:id",
  validateParams(paramsIdZodSchema),
  DoctorController.getDoctorById,
);

router.patch(
  "/:id",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  validateParams(paramsIdZodSchema),
  validateRequestBody(UpdateDoctorZodSchema),
  DoctorController.updateDoctorById,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  validateParams(paramsIdZodSchema),
  DoctorController.deleteDoctorById,
);

export { router as DoctorRoutes };
