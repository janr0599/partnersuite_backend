import { Router } from "express";
import AuthController from "../controllers/AuthController";
import {
    authenticate,
    validateEmail,
    validateLogin,
    validateManagerData,
    validateNewPassword,
} from "../middleware/authMiddleware";
import { validateToken } from "../middleware/validationMiddleware";

const router = Router();

router.post(
    "/create-account",
    validateManagerData,
    AuthController.createAccount
);
router.post("/login", validateLogin, AuthController.login);
router.post("/login-affiliate", authenticate, AuthController.login);
router.get("/user", authenticate, AuthController.user);

router.post("/forgot-password", validateEmail, AuthController.forgotPassword);
router.post("/validate-token", validateToken, AuthController.validateToken);
router.post(
    "/update-password/:token",
    validateNewPassword,
    AuthController.updatePasswordWithToken
);

export default router;
