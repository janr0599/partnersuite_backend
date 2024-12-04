import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { validateObjectId } from "../middleware/validationMiddleware";
import { NotificationsController } from "../controllers/NotificationsController";

const router = Router();
router.use(authenticate);

router.get("/", NotificationsController.getNotifications);
router.post(
    "/:notificationId",
    validateObjectId,
    NotificationsController.markNotificationAsRead
);
router.post("/", NotificationsController.markAllNotificationsAsRead);

export default router;
