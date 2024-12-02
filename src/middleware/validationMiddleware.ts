import { Request, Response, NextFunction } from "express";
import { objectIdSchema } from "../schemas/validationSchemas";

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
