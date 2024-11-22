import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import TopUpRequestsController from "../controllers/TopUpRequestsController";
// import { TopUpRequestType } from "../types/TopUpRequests";
// import { TopUpRequestParams } from "../types/TopUpRequests";
// import { TopUpRequestStatus } from "../models/TopUpRequest";
// import { TopUpRequest } from "../models/TopUpRequest";

const router = Router();

router.use(authenticate);

router.post("/", TopUpRequestsController.createTopUpRequest);
router.get("/", TopUpRequestsController.getTopUpRequests);

export default router;
