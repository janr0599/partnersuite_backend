import { Document, Types } from "mongoose";

export type TokenType = Document & {
    token: string;
    recipient: Types.ObjectId;
    recipientModel: "Affiliate" | "Manager";
    createdAt: Date;
};
