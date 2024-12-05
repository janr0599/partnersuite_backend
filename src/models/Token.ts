import mongoose, { Schema, Types } from "mongoose";
import { TokenType } from "../types/Token";

const tokenSchema: Schema = new Schema(
    {
        token: {
            type: String,
            required: true,
        },
        recipient: {
            type: Types.ObjectId,
            required: true,
            refPath: "recipientModel",
        },
        recipientModel: {
            type: String,
            required: true,
            enum: ["Affiliate", "Manager"], // Ensure only these models are referenced
        },
        createdAt: {
            type: Date,
            default: () => Date.now(),
            expires: "15m",
        },
    },
    { timestamps: true }
);

const Token = mongoose.model<TokenType>("Token", tokenSchema);
export default Token;
