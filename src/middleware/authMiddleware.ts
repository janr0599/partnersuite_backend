import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Manager from "../models/Manager";
import Affiliate from "../models/Affiliate";
import { UserType } from "../types/User";
import {
    affiliateRegistrationSchema,
    loginSchema,
    managerRegistrationSchema,
    requestCodeSchema,
    resetPasswordSchema,
} from "../schemas/usersSchemas";
import { tokenSchema } from "../schemas/validationSchemas";

declare global {
    namespace Express {
        interface Request {
            user?: UserType;
        }
    }
}

export const validateManagerData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validation = managerRegistrationSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ message: validation.error.issues });
        return;
    } else {
        next();
    }
};

export const validateAffiliateData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validation = affiliateRegistrationSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ message: validation.error.issues });
        return;
    } else {
        next();
    }
};

export const validateLogin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ error: validation.error.issues });
    } else {
        next();
    }
};

export const validateEmail = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validation = requestCodeSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ error: validation.error.issues });
    } else {
        next();
    }
};

export const validateNewPassword = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { token } = req.params;
    const tokenValidation = tokenSchema.safeParse(token);
    if (!tokenValidation.success) {
        res.status(400).json({ error: tokenValidation.error.issues });
    }

    const validation = resetPasswordSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ error: validation.error.issues });
    } else {
        next();
    }
};

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error("Not authorized");
        res.status(401).json({ error: error.message });
        return;
    }

    const token = bearer.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "object" && decoded.id) {
            let user: UserType | null = null;

            if (decoded.role === "manager") {
                user = await Manager.findById(decoded.id);
            } else if (decoded.role === "affiliate") {
                user = await Affiliate.findById(decoded.id).populate(
                    "manager",
                    "name"
                );
            }

            if (user) {
                req.user = user;
            } else {
                res.status(500).json({ error: "Invalid token" });
                return;
            }
        }
    } catch (error) {
        res.status(500).json({ error: "Invalid token" });
        return;
    }
    next();
};
