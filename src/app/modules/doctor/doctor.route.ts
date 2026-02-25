import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { validateParams } from "../../middleware/zod-middleware";
import { paramsIdZodSchema } from "../../validation/params.zod";

const router: Router = Router();

router.get("/", DoctorController.getAllDoctors);

router.get(
  "/:id",
  validateParams(paramsIdZodSchema),
  DoctorController.getDoctorById,
);

router.patch("/:id", DoctorController.updateDoctorById);

router.delete("/:id", DoctorController.deleteDoctorById);

export { router as DoctorRoutes };
