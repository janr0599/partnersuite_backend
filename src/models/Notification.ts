import { Schema, model, Types } from "mongoose";
import { NotificationType } from "../types/Notifications";

export const notificationStatus = {
    READ: "read",
    UNREAD: "unread",
} as const;

export const notificationTypes = {
    TOP_UP_REQUEST: "topUpRequest",
    TICKET_COMMENT: "ticketComment",
} as const;

const notificationSchema = new Schema(
    {
        message: {
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
        status: {
            type: String,
            enum: Object.values(notificationStatus),
            default: notificationStatus.UNREAD,
        },
        type: {
            type: String,
            required: true,
            enum: Object.values(notificationTypes),
        },
        link: {
            type: String,
        }, // URL or path to the related resource, if any
    },
    { timestamps: true }
);

const Notification = model<NotificationType>(
    "Notification",
    notificationSchema
);

export default Notification;
