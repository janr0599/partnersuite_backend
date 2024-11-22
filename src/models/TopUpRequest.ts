import { Schema, model, Types } from "mongoose";
import { TopUpRequestType } from "../types/TopUpRequests";

export const TopUpRequestStatus = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
} as const;

const TopUpRequestSchema = new Schema(
    {
        createdBy: {
            type: Types.ObjectId,
            ref: "Affiliate",
        },
        BonusAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(TopUpRequestStatus),
            default: TopUpRequestStatus.PENDING,
        },
    },
    { timestamps: true }
);

const TopUpRequest = model<TopUpRequestType>(
    "TopUpRequest",
    TopUpRequestSchema
);
export default TopUpRequest;
