import { Router } from "express";
import {
    authenticate,
    validateAffiliateData,
} from "../middleware/authMiddleware";
import AffiliatesController from "../controllers/AffiliatesController";
import { validateObjectId } from "../middleware/validationMiddleware";
import {
    affiliateExists,
    validateAffiliateUpdateData,
    validateAffiliateUpdateStatusData,
} from "../middleware/affiliatesMiddleware";

const router = Router();

router.use(authenticate);
router.param("affiliateId", validateObjectId);
router.param("affiliateId", affiliateExists);

router.post("/", validateAffiliateData, AffiliatesController.addAffiliate);
router.post("/bulk-add", AffiliatesController.bulkAddAffiliates);
router.get("/", AffiliatesController.getAffiliates);
router.get("/:affiliateId", AffiliatesController.getAffiliateById);
router.put(
    "/:affiliateId",
    validateAffiliateUpdateData,
    AffiliatesController.updateAffiliate
);
router.patch(
    "/:affiliateId/status",
    validateAffiliateUpdateStatusData,
    AffiliatesController.updateAffiliateStatus
);
router.delete("/:affiliateId", AffiliatesController.deleteAffiliate);

export default router;
