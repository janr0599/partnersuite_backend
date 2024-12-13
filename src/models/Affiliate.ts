import { Schema, model, Types } from "mongoose";
import { AffiliateType } from "../types/Affiliates";
import Manager from "./Manager";

export const contractTypes = {
    CPA: "CPA",
    RevShare: "RevShare",
    Hybrid: "Hybrid",
} as const;

export const affiliateStatuses = {
    Active: "active",
    Inactive: "inactive",
} as const;

const AffiliateSchema = new Schema(
    {
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
        image: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: Object.values(affiliateStatuses),
            default: affiliateStatuses.Active,
        },
        tickets: [
            {
                type: Types.ObjectId,
                ref: "Ticket",
            },
        ],
        topUpRequests: [
            {
                type: Types.ObjectId,
                ref: "TopUpRequest",
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
        country: {
            type: String,
            required: true,
        },
        BonusAmount: {
            type: Number,
            default: 0,
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
    },
    { timestamps: true }
);

AffiliateSchema.pre("deleteOne", { document: true }, async function () {
    const affiliateId = this._id;
    if (!affiliateId) return;
    await Manager.updateOne(
        { affiliates: affiliateId },
        { $pull: { affiliates: affiliateId } }
    );
});

const Affiliate = model<AffiliateType>("Affiliate", AffiliateSchema);
export default Affiliate;
