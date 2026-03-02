import { Router } from "express";
import { AdminController } from "./admin.controller";
import {
  validateParams,
  validateRequestBody,
} from "../../middleware/zod-middleware";
import { ParamsIdZodSchema } from "../../validation/params.validation";
import { AdminValidation } from "./admin.validation";
import authMiddleware from "../../middleware/auth-middleware";
import { UserRole } from "@prisma/client";

const router: Router = Router();

router.get(
  "/",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.getAllAdmins,
);

router.get(
  "/:id",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateParams(ParamsIdZodSchema),
  AdminController.getAdminById,
);

router.patch(
  "/:id",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateParams(ParamsIdZodSchema),
  validateRequestBody(AdminValidation.UpdateAdminValidationSchema),
  AdminController.updateAdminById,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateParams(ParamsIdZodSchema),
  AdminController.deleteAdminById,
);

export { router as AdminRoutes };
