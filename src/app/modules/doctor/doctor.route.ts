import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router: Router = Router();

router.get("/", DoctorController.getAllDoctors);

export { router as DoctorRoutes };
