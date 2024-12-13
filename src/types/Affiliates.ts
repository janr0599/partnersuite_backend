import { Document, Types } from "mongoose";
import { affiliateStatuses, contractTypes } from "../models/Affiliate";
import { TopUpRequestType } from "./TopUpRequests";
import { ManagerType } from "./Managers";

export type AffiliateStatus =
    (typeof affiliateStatuses)[keyof typeof affiliateStatuses];

export type AffiliateContractTypes =
    (typeof contractTypes)[keyof typeof contractTypes];

export type AffiliateType = Document & {
    name: string;
    email: string;
    password: string;
    role: string;
    manager: Types.ObjectId | ManagerType;
    image: string;
    status: AffiliateStatus;
    tickets: Types.ObjectId[];
    topUpRequests: (Types.ObjectId | TopUpRequestType)[];
    platform: string;
    contractType: AffiliateContractTypes;
    country: string;
    BonusAmount?: number;
    CPA?: number;
    RevShare?: number;
    Baseline?: number;
    _id: Types.ObjectId;
};
