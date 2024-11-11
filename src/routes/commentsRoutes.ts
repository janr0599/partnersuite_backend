import { Router } from "express";
import CommentsController from "../controllers/CommentsController";
import { validateCommentContent } from "../middleware/commentsMiddleware";

const router = Router({ mergeParams: true });

router.post("/", validateCommentContent, CommentsController.createComment);

export default router;
