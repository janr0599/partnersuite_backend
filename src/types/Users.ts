import { Document, Types } from "mongoose";
import { roles } from "../models/User";

export type Roles = (typeof roles)[keyof typeof roles];

export type UserType = Document & {
    name: string;
    email: string;
    password: string;
    role: Roles;
    manager: Types.ObjectId;
    affiliates: Types.ObjectId[];
    _id: Types.ObjectId;
};

export type UserPayload = {
    id: Types.ObjectId;
};
