import { Router } from "express";
import { authenticate, validateUserData } from "../middleware/authMiddleware";
import AffiliatesController from "../controllers/AffiliatesController";

const router = Router();

router.post(
    "/add-affiliate",
    authenticate,
    validateUserData,
    AffiliatesController.addAffiliate
);

export default router;
