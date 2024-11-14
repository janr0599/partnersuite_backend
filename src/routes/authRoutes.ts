import { Router } from "express";
import AuthController from "../controllers/AuthController";
import {
    validateLogin,
    validateManagerData,
} from "../middleware/authMiddleware";

const router = Router();

router.post(
    "/create-account",
    validateManagerData,
    AuthController.createAccount
);
router.post("/login", validateLogin, AuthController.login);

export default router;
