import { Document, Types } from "mongoose";

export type AffiliateType = Document & {
    name: string;
    email: string;
    password: string;
    role: string;
    manager: Types.ObjectId;
    tickets: Types.ObjectId[];
    platform: string;
    contractType: string;
    CPA?: number;
    RevShare?: number;
    _id: Types.ObjectId;
};
