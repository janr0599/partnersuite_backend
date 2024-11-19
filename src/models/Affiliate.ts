import { Schema, model, Types } from "mongoose";
import { AffiliateType } from "../types/Affiliates";

export const contractTypes = {
    CPA: "CPA",
    RevShare: "RevShare",
    Hybrid: "Hybrid",
} as const;

export const affiliateStatuses = {
    active: "active",
    inactive: "inactive",
};

const AffiliateSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        default: "affiliate",
    },
    manager: {
        type: Types.ObjectId,
        required: true,
        ref: "Manager",
    },
    status: {
        type: String,
        enum: Object.values(affiliateStatuses),
        default: "active",
    },
    tickets: [
        {
            type: Types.ObjectId,
            ref: "Ticket",
        },
    ],
    platform: {
        type: String,
        required: true,
    },
    contractType: {
        type: String,
        required: true,
        enum: Object.values(contractTypes),
    },
    CPA: {
        type: Number,
        required: function () {
            return this.contractType === contractTypes.CPA;
        },
        default: 0,
    },
    RevShare: {
        type: Number,
        required: function () {
            return this.contractType === contractTypes.RevShare;
        },
        default: 0,
    },
    Baseline: {
        type: Number,
        default: 0,
    },
});

const Affiliate = model<AffiliateType>("Affiliate", AffiliateSchema);
export default Affiliate;
