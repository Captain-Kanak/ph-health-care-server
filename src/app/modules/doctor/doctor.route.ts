import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router: Router = Router();

router.get("/", DoctorController.getAllDoctors);

router.get("/:id", DoctorController.getDoctorById);

router.patch("/:id", DoctorController.updateDoctorById);

router.delete("/:id", DoctorController.deleteDoctorById);

export { router as DoctorRoutes };
