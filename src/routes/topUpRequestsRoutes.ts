import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import TopUpRequestsController from "../controllers/TopUpRequestsController";
import { validateObjectId } from "../middleware/validationMiddleware";
import { validateTopUpRequestExists } from "../middleware/topUpRequestsMiddleware";

const router = Router();
router.use(authenticate);

router.param("topUpRequestId", validateObjectId);
router.param("topUpRequestId", validateTopUpRequestExists);

router.post("/", TopUpRequestsController.createTopUpRequest);
router.get("/", TopUpRequestsController.getTopUpRequests);
router.patch(
    "/:topUpRequestId",
    TopUpRequestsController.updateTopUpRequestStatus
);
router.delete("/:topUpRequestId", TopUpRequestsController.deleteTopUpRequest);

export default router;
