import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { validateLogin, validateUserData } from "../middleware/authMiddleware";

const router = Router();

router.post("/create-account", validateUserData, AuthController.createAccount);
router.post("/login", validateLogin, AuthController.login);

export default router;
