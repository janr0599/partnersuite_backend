import { Request, Response, NextFunction } from "express";
import { objectIdSchema, tokenSchema } from "../schemas/validationSchemas";

export const validateObjectId = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { ticketId, commentId, affiliateId, topUpRequestId, notificationId } =
        req.params;
    const validation = objectIdSchema.safeParse(
        ticketId || commentId || affiliateId || topUpRequestId || notificationId
    );

    if (!validation.success) {
        res.status(400).json(validation.error.issues);
        return;
    }

    next();
};

export const validateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { token } = req.body;
    const validation = tokenSchema.safeParse(token);
    if (!validation.success) {
        res.json({ error: validation.error.issues });
    } else {
        next();
    }
};
