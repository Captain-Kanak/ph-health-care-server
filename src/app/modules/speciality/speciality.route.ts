import { Router } from "express";
import { SpecialityController } from "./speciality.controller";
import authMiddleware from "../../middleware/auth-middleware";
import { UserRole } from "@prisma/client";
import {
  validateParams,
  validateRequestBody,
} from "../../middleware/zod-middleware";
import { ParamsIdZodSchema } from "../../validation/params.validation";
import { SpecialityValidation } from "./speciality.validation";
import { multerUpload } from "../../../config/multer.config";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  multerUpload.single("file"),
  validateRequestBody(SpecialityValidation.CreateSpecialityZodSchema),
  SpecialityController.createSpeciality,
);

router.get("/", SpecialityController.getSpecialities);

router.get(
  "/:id",
  validateParams(ParamsIdZodSchema),
  SpecialityController.getSpecialityById,
);

router.patch(
  "/:id",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateParams(ParamsIdZodSchema),
  validateRequestBody(SpecialityValidation.UpdateSpecialityZodSchema),
  SpecialityController.updateSpeciality,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateParams(ParamsIdZodSchema),
  SpecialityController.deleteSpeciality,
);

export { router as SpecialityRoutes };
