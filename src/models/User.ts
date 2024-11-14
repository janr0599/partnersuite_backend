import { Schema, model, Types } from "mongoose";
import { UserType } from "../types/Users";

export const roles = {
    manager: "manager",
    affiliate: "affiliate",
} as const;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: Object.values(roles),
        required: true,
    },
    manager: {
        type: Types.ObjectId,
        ref: "User",
    },
    affiliates: [
        {
            type: Types.ObjectId,
            ref: "User",
        },
    ],
});

UserSchema.pre("save", function (next) {
    if (this.role === roles.affiliate) {
        this.affiliates = undefined; // Remove affiliates field for affiliates
    }
    next();
});

const User = model<UserType>("User", UserSchema);
export default User;
