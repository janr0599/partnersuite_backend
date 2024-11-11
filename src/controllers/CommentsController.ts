import { Request, Response } from "express";
import Comment from "../models/Comment";
import { CommentType } from "../types/Comments";

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

            req.ticket.comments.push(comment.id);

            await Promise.allSettled([req.ticket.save(), comment.save()]);
            res.status(201).json({ message: "Comment created successfully" });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };
}

export default CommentsController;
