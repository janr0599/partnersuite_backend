import { Request, Response, NextFunction } from "express";
import Affiliate from "../models/Affiliate";
import { AffiliateType } from "../types/Affiliates";
import {
    affiliateUpdateSchema,
    affiliateUpdateStatusSchema,
} from "../schemas/usersSchemas";

declare global {
    namespace Express {
        interface Request {
            affiliate: AffiliateType;
        }
    }
}

export const affiliateExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { affiliateId } = req.params;

    try {
        const affiliate = await Affiliate.findById(affiliateId).select(
            "-password"
        );
        if (!affiliate) {
            res.status(404).json({ message: "Affiliate not found" });
            return;
        }

        req.affiliate = affiliate;
        next();
    } catch (error) {
        res.status(500).json({ message: "there's been an error" });
    }
};

export const validateAffiliateUpdateData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validation = affiliateUpdateSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ message: validation.error.issues });
        return;
    } else {
        next();
    }
};

export const validateAffiliateUpdateStatusData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validation = affiliateUpdateStatusSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ message: validation.error.issues });
        return;
    } else {
        next();
    }
};
