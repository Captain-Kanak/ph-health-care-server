import { Router } from "express";
import { SpecialityController } from "./speciality.controller";
import authMiddleware from "../../middleware/auth-middleware";
import { UserRole } from "@prisma/client";
import {
  validateParams,
  validateRequestBody,
} from "../../middleware/zod-middleware";
import { SpecialityZodSchema } from "../../validation/speciality.zod";
import { paramsIdZodSchema } from "../../validation/params.zod";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequestBody(SpecialityZodSchema),
  SpecialityController.createSpeciality,
);

router.get("/", SpecialityController.getSpecialities);

router.get(
  "/:id",
  validateParams(paramsIdZodSchema),
  SpecialityController.getSpecialityById,
);

router.patch(
  "/:id",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateParams(paramsIdZodSchema),
  validateRequestBody(SpecialityZodSchema),
  SpecialityController.updateSpeciality,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateParams(paramsIdZodSchema),
  SpecialityController.deleteSpeciality,
);

export { router as SpecialityRoutes };
