import { Schema, model, Types } from "mongoose";
import { CommentType } from "../types/Comments";

const CommentSchema: Schema = new Schema(
    {
        content: {
            type: String,
            trim: true,
            required: true,
        },
        // createdBy: {
        //     type: Types.ObjectId,
        //     ref: "User",
        // },
        ticket: {
            type: Types.ObjectId,
            ref: "Ticket",
        },
    },
    { timestamps: true }
);

const Comment = model<CommentType>("Comment", CommentSchema);
export default Comment;
