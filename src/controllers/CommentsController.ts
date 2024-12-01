import { Request, Response } from "express";
import Comment from "../models/Comment";
import { CommentParams, CommentType } from "../types/Comments";
import { isManager } from "../types/User";
import { sendNotificationEmail } from "../emails/NotificationsEmail";

class CommentsController {
    static createComment = async (
        req: Request<{}, {}, CommentType>,
        res: Response
    ) => {
        const { content } = req.body;
        try {
            const comment = new Comment();
            comment.content = content;
            comment.ticket = req.ticket._id;
            comment.createdBy = req.user._id;

            if (isManager(req.user)) {
                comment.createdByModel = "Manager";
            } else {
                comment.createdByModel = "Affiliate";
            }

            req.ticket.comments.push(comment.id);

            await Promise.allSettled([req.ticket.save(), comment.save()]);

            sendNotificationEmail();

            res.status(201).json({ message: "Comment created successfully" });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static updateComment = async (
        req: Request<CommentParams, {}, CommentType>,
        res: Response
    ) => {
        const { content } = req.body;
        const { commentId } = req.params;
        try {
            const comment = await Comment.findById(commentId);
            comment.content = content;
            await comment.save();
            res.status(200).json({ message: "Comment updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static deleteComment = async (
        req: Request<CommentParams, {}, CommentType>,
        res: Response
    ) => {
        const { commentId } = req.params;
        try {
            const comment = await Comment.findById(commentId);
            const ticket = req.ticket;

            ticket.comments = ticket.comments.filter(
                (comment) => comment._id.toString() !== commentId.toString()
            );

            await Promise.allSettled([ticket.save(), comment.deleteOne()]);
            res.status(200).json({ message: "Comment deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };
}

export default CommentsController;
