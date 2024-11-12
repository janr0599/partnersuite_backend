import { Router } from "express";
import CommentsController from "../controllers/CommentsController";
import { validateCommentContent } from "../middleware/commentsMiddleware";
import { validateObjectId } from "../middleware/validationMiddleware";

const router = Router({ mergeParams: true });
router.param("commentId", validateObjectId);

router.post("/", validateCommentContent, CommentsController.createComment);
router.put(
    "/:commentId",
    validateCommentContent,
    CommentsController.updateComment
);
router.delete("/:commentId", CommentsController.deleteComment);

export default router;
