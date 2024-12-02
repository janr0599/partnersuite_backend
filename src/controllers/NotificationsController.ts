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

    static updateNotificationStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body;

            const notification = await Notification.findById(req.params.id);
            if (!notification) {
                res.status(404).json({ message: "Notification not found" });
                return;
            }

            notification.status = status;
            await notification.save();

            res.status(200).json({
                message: "Notification status updated successfully",
            });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };
}
