import { Request, Response, NextFunction } from "express";
import { commentSchema } from "../schemas/commentsSchemas";

export const validateCommentContent = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validation = commentSchema.safeParse(req.body);
    if (!validation.success) {
        res.json({ message: validation.error.issues });
        return;
    }

    next();
};
