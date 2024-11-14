import { Request, Response, NextFunction } from "express";
import { loginSchema, registrationSchema } from "../schemas/usersSchemas";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { UserType } from "../types/Users";

declare global {
    namespace Express {
        interface Request {
            user?: UserType;
        }
    }
}

export const validateUserData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validation = registrationSchema.safeParse(req.body);
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
            const user = await User.findById(decoded.id).select(
                "_id email name role affiliates"
            );
            if (user) {
                req.user = user;
            } else {
                res.status(500).json({ error: "Invalid token" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: "Invalid token" });
        return;
    }
    next();
};
