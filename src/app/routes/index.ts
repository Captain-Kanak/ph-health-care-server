import { Router } from "express";
import { SpecialityRoutes } from "../modules/speciality/speciality.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";
import { AdminRoutes } from "../modules/admin/admin.route";

const router: Router = Router();

router.use("/auth", AuthRoutes);

router.use("/specialities", SpecialityRoutes);

router.use("/users", UserRoutes);

router.use("/admins", AdminRoutes);

router.use("/doctors", DoctorRoutes);

export { router as IndexRoutes };
