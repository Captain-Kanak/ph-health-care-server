import { Router } from "express";
import { SpecialityRoute } from "../modules/speciality/speciality.route";

const router: Router = Router();

router.use("/specialities", SpecialityRoute);

export { router as IndexRoute };
