import { Router } from "express";
import { AuthController } from "./auth.controller";

const router: Router = Router();

router.post("/register", AuthController.registerPatient);

router.post("/login", AuthController.loginUser);

export { router as AuthRoutes };
