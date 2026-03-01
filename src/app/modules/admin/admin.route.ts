import { Router } from "express";
import { AdminController } from "./admin.controller";
import {
  validateParams,
  validateRequestBody,
} from "../../middleware/zod-middleware";
import { ParamsIdZodSchema } from "../../validation/params.validation";
import { AdminValidation } from "./admin.validation";

const router: Router = Router();

router.get("/", AdminController.getAllAdmins);

router.get(
  "/:id",
  validateParams(ParamsIdZodSchema),
  AdminController.getAdminById,
);

router.patch(
  "/:id",
  validateParams(ParamsIdZodSchema),
  validateRequestBody(AdminValidation.UpdateAdminValidationSchema),
  AdminController.updateAdminById,
);

router.delete(
  "/:id",
  validateParams(ParamsIdZodSchema),
  AdminController.deleteAdminById,
);

export { router as AdminRoutes };
