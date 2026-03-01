import { Router } from "express";
import { AdminController } from "./admin.controller";

const router: Router = Router();

router.get("/", AdminController.getAllAdmins);

export { router as AdminRoutes };
