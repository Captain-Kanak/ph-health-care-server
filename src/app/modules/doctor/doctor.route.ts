import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import {
  validateParams,
  validateRequestBody,
} from "../../middleware/zod-middleware";
import { paramsIdZodSchema } from "../../validation/params.zod";
import { UpdateDoctorZodSchema } from "../../validation/doctor.zod";
import authMiddleware from "../../middleware/auth-middleware";

const router: Router = Router();

router.get("/", authMiddleware(), DoctorController.getAllDoctors);

router.get(
  "/:id",
  validateParams(paramsIdZodSchema),
  DoctorController.getDoctorById,
);

router.patch(
  "/:id",
  validateParams(paramsIdZodSchema),
  validateRequestBody(UpdateDoctorZodSchema),
  DoctorController.updateDoctorById,
);

router.delete("/:id", DoctorController.deleteDoctorById);

export { router as DoctorRoutes };
