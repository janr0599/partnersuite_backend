import { Router } from "express";
import AuthController from "../controllers/AuthController";
import {
    authenticate,
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
router.get("/user", authenticate, AuthController.user);

export default router;
