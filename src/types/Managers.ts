import { Document, Types } from "mongoose";

export type ManagerType = Document & {
    name: string;
    email: string;
    password: string;
    role: string;
    affiliates: Types.ObjectId[];
    _id: Types.ObjectId;
};

export type UserPayload = {
    id: Types.ObjectId;
    role: string;
};
