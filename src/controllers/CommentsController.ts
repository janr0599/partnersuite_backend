import { Request, Response } from "express";
import Comment from "../models/Comment";
import { CommentParams, CommentType } from "../types/Comments";
import { isManager } from "../types/User";
import { NotificationEmail } from "../emails/NotificationsEmail";
import Affiliate from "../models/Affiliate";
import Notification, {
    notificationStatus,
    notificationTypes,
} from "../models/Notification";
import Manager from "../models/Manager";

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

            // Email Notification
            let recipientEmail = "";
            let recipientName = "";
            let affiliateName = "";
            let role = "";
            let recipientId;
            let recipientModel;

            if (isManager(req.user)) {
                comment.createdByModel = "Manager";
                // Find the affiliate associated with this ticket or comment
                const affiliate = await Affiliate.findById(
                    req.ticket.createdBy
                );
                if (affiliate) {
                    recipientEmail = affiliate.email;
                    recipientName = affiliate.name;
                    role = "Manager";
                    recipientId = affiliate._id;
                    recipientModel = "Affiliate";
                }
            } else {
                comment.createdByModel = "Affiliate";
                // Find the manager of the affiliate
                const manager = await Manager.findById(req.user.manager);
                if (manager) {
                    // Find the affiliate associated with this ticket or comment
                    const affiliate = await Affiliate.findById(
                        req.ticket.createdBy
                    );
                    recipientEmail = manager.email;
                    recipientName = manager.name;
                    affiliateName = affiliate.name;
                    role = "Affiliate";
                    recipientId = manager._id;
                    recipientModel = "Manager";
                }
            }

            req.ticket.comments.push(comment.id);

            await Promise.allSettled([req.ticket.save(), comment.save()]);

            // Send email notification
            if (recipientEmail) {
                NotificationEmail.newCommentEmail({
                    email: recipientEmail,
                    name: recipientName,
                    affiliateName,
                    role,
                    ticketId: req.ticket.id,
                });
            } else {
                console.warn("Recipient email not found.");
            }

            // Create and save frontend notification
            if (recipientId && recipientModel) {
                const affiliate = await Affiliate.findById(
                    req.ticket.createdBy
                );
                const notification = new Notification({
                    message: `${
                        isManager(req.user)
                            ? `A new comment has been added to your ticket.`
                            : `${affiliate.name} has added a new comment to their ticket.`
                    }`,
                    recipient: recipientId,
                    recipientModel,
                    status: notificationStatus.UNREAD,
                    type: notificationTypes.TICKET_COMMENT,
                    link: `?viewTicket=${req.ticket.id}`,
                });
                await notification.save();
            } else {
                console.warn("Recipient not found for notification.");
            }

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
