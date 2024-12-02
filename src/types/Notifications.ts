import { Document, Types } from "mongoose";
import { notificationStatus } from "../models/Notification";

export type NotificationStatus =
    (typeof notificationStatus)[keyof typeof notificationStatus];

export type NotificationType = Document & {
    message: string;
    recipient: Types.ObjectId;
    recipientModel: "Affiliate" | "Manager";
    status: NotificationStatus;
    link: string;
    _id: Types.ObjectId;
};
