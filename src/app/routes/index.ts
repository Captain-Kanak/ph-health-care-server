import { Router } from "express";
import { SpecialityRoutes } from "../modules/speciality/speciality.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";

const router: Router = Router();

router.use("/auth", AuthRoutes);

router.use("/users", UserRoutes);

router.use("/specialities", SpecialityRoutes);

export { router as IndexRoutes };
