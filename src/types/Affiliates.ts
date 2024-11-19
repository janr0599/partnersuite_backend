import { Document, Types } from "mongoose";

export type AffiliateType = Document & {
    name: string;
    email: string;
    password: string;
    role: string;
    manager: Types.ObjectId;
    status: string;
    tickets: Types.ObjectId[];
    platform: string;
    contractType: string;
    CPA?: number;
    RevShare?: number;
    Baseline?: number;
    _id: Types.ObjectId;
};
