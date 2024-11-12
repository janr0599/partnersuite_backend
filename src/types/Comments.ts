import { Document, Types } from "mongoose";

export type CommentType = Document & {
    content: string;
    // createdBy: Types.ObjectId;
    ticket: Types.ObjectId;
    _id: Types.ObjectId;
};

export type CommentParams = {
    commentId: string;
};