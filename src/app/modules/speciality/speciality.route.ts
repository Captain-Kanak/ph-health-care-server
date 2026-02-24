import { Router } from "express";
import { SpecialityController } from "./speciality.controller";

const router: Router = Router();

router.post("/", SpecialityController.createSpeciality);

router.get("/", SpecialityController.getSpecialities);

router.patch("/:id", SpecialityController.updateSpeciality);

router.delete("/:id", SpecialityController.deleteSpeciality);

export { router as SpecialityRoutes };
