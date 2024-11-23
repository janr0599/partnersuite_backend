import { Request, Response, NextFunction } from "express";
import TopUpRequest from "../models/TopUpRequest";
import { TopUpRequestType } from "../types/TopUpRequests";

declare global {
    namespace Express {
        interface Request {
            topUpRequest: TopUpRequestType;
        }
    }
}

export const validateTopUpRequestExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { topUpRequestId } = req.params;

    try {
        const topUpRequest = await TopUpRequest.findById(topUpRequestId);

        if (!topUpRequest) {
            res.status(404).json({ message: "Top-Up Request not found" });
            return;
        }

        req.topUpRequest = topUpRequest;

        next();
    } catch (error) {
        return res.status(500).json({ message: "there's been an error" });
    }
};
