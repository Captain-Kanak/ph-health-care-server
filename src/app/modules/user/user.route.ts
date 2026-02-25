import { Router } from "express";
import { UserController } from "./user.controller";
import { createDoctorZodSchema } from "../../validation/doctor.zod";
import { validateRequestBody } from "../../middleware/validation-middleware";

const router: Router = Router();

router.post(
  "/create-doctor",
  validateRequestBody(createDoctorZodSchema),
  UserController.createDoctor,
);

export { router as UserRoutes };
