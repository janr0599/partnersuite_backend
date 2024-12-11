import { Request, Response } from "express";
import Notification from "../models/Notification";

export class NotificationsController {
    static getNotifications = async (req: Request, res: Response) => {
        try {
            const notifications = await Notification.find({
                recipient: req.user._id,
            }).sort({ createdAt: "desc" });
            res.status(200).json({ notifications: notifications });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static markNotificationAsRead = async (req: Request, res: Response) => {
        try {
            const notification = await Notification.findById(
                req.params.notificationId
            );
            if (!notification) {
                res.status(404).json({ message: "Notification not found" });
                return;
            }

            notification.status = "read";
            await notification.save();

            res.status(200).json({
                message: "Notification status updated successfully",
            });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static markAllNotificationsAsRead = async (req: Request, res: Response) => {
        try {
            const notifications = await Notification.find({
                recipient: req.user._id,
            });

            for (const notification of notifications) {
                notification.status = "read";
                await notification.save();
            }

            res.status(200).json({
                message: "All notifications marked as read successfully",
            });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static deleteAllNotifications = async (req: Request, res: Response) => {
        try {
            const notifications = await Notification.find({
                recipient: req.user._id,
            });
            for (const notification of notifications) {
                await notification.deleteOne();
            }
            res.status(200).json({
                message: "All notifications deleted successfully",
            });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };
}
