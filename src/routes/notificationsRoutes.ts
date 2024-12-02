import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { validateObjectId } from "../middleware/validationMiddleware";
import { NotificationsController } from "../controllers/NotificationsController";

const router = Router();
router.use(authenticate);

router.get("/", NotificationsController.getNotifications);
router.patch(
    "/:notificationId",
    validateObjectId,
    NotificationsController.updateNotificationStatus
);

export default router;
