import { Schema, model, Types } from "mongoose";
import { CommentType } from "../types/Comments";

const CommentSchema: Schema = new Schema(
    {
        content: {
            type: String,
            trim: true,
            required: true,
        },
        createdBy: {
            type: Types.ObjectId,
            required: true,
            refPath: "createdByModel",
        },
        createdByModel: {
            type: String,
            required: true,
            enum: ["Affiliate", "Manager"], // Ensure only these models are referenced
        },
        ticket: {
            type: Types.ObjectId,
            ref: "Ticket",
        },
    },
    { timestamps: true }
);

const Comment = model<CommentType>("Comment", CommentSchema);
export default Comment;
