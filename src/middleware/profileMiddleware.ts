import { Request, Response, NextFunction } from "express";
import {
    changeCurrentPasswordSchema,
    updateProfileSchema,
} from "../schemas/profileSchemas";

export const validateProfileData = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ error: validation.error.issues });
    } else {
        next();
    }
};

export const validateChangeCurrentPassword = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validation = changeCurrentPasswordSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ error: validation.error.issues });
    } else {
        next();
    }
};
