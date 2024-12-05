import { Document, Types } from "mongoose";
import { notificationStatus, notificationTypes } from "../models/Notification";

export type NotificationStatus =
    (typeof notificationStatus)[keyof typeof notificationStatus];

export type NotificationTypes =
    (typeof notificationTypes)[keyof typeof notificationTypes];

export type NotificationType = Document & {
    message: string;
    recipient: Types.ObjectId;
    recipientModel: "Affiliate" | "Manager";
    status: NotificationStatus;
    type: NotificationTypes;
    link: string;
    _id: Types.ObjectId;
};
