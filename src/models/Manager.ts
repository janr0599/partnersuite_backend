import { Schema, model, Types } from "mongoose";
import { ManagerType } from "../types/Managers";

const ManagerSchema = new Schema({
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
        default: "manager",
    },
    image: {
        type: String,
        default: "",
    },
    affiliates: [
        {
            type: Types.ObjectId,
            ref: "Affiliate",
        },
    ],
});

const Manager = model<ManagerType>("Manager", ManagerSchema);
export default Manager;
