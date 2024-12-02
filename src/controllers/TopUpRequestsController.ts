import { Request, Response } from "express";
import TopUpRequest from "../models/TopUpRequest";
import { isAffiliate, isManager } from "../types/User";
import Manager from "../models/Manager";
import Affiliate from "../models/Affiliate";
import {
    TopUpRequestParams,
    TopUpRequestStatusType,
    TopUpRequestType,
} from "../types/TopUpRequests";
import { NotificationEmail } from "../emails/NotificationsEmail";
import Notification, { notificationStatus } from "../models/Notification";

class TopUpRequestsController {
    static createTopUpRequest = async (req: Request, res: Response) => {
        const affiliateId = req.user._id;
        try {
            if (!isAffiliate(req.user)) {
                const error = new Error("Invalid action");
                res.status(401).json({ message: error.message });
                return;
            }

            const affiliate = await Affiliate.findById(affiliateId).populate(
                "topUpRequests"
            );
            const topUpRequests = affiliate.topUpRequests as TopUpRequestType[];

            if (!affiliate) {
                const error = new Error("Affiliate not found");
                res.status(404).json({ message: error.message });
                return;
            }

            const pendingTopUpRequest = topUpRequests.find(
                (topUpRequest) => topUpRequest.status === "Pending"
            );

            if (pendingTopUpRequest) {
                const error = new Error(
                    "You already have a pending top-up request, please wait for it to be approved or rejected"
                );
                res.status(400).json({ message: error.message });
                return;
            }

            const topUpRequest = new TopUpRequest({
                createdBy: req.user._id,
                BonusAmount: req.user.BonusAmount,
            });

            affiliate.topUpRequests.push(topUpRequest._id);

            Promise.allSettled([affiliate.save(), topUpRequest.save()]);
            res.status(201).json({
                message: "Top-Up Request created successfully",
            });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static getTopUpRequests = async (req: Request, res: Response) => {
        try {
            let query = {};

            if (isManager(req.user)) {
                // Fetch the manager affiliates
                const manager = await Manager.findById(req.user.id).populate(
                    "affiliates"
                );

                const affiliateIds = manager.affiliates.map(
                    (affiliate) => affiliate.id
                );
                query = {
                    createdBy: { $in: affiliateIds },
                };
            } else if (isAffiliate(req.user)) {
                query = {
                    createdBy: req.user.id,
                };
            }

            const topUpRequests = await TopUpRequest.find(query)
                .populate("createdBy", "_id name role email")
                .sort({ createdAt: "desc" });
            res.status(200).json({ topUpRequests: topUpRequests });
        } catch (error) {
            console.error("Error fetching top-up requests:", error.message);
            res.status(500).json({ message: "There's been an error" });
        }
    };

    static deleteTopUpRequest = async (
        req: Request<TopUpRequestParams, {}, {}>,
        res: Response
    ) => {
        const topUpRequestId = req.topUpRequest.id;

        try {
            if (!isAffiliate(req.user)) {
                const error = new Error("Invalid action");
                res.status(401).json({ message: error.message });
                return;
            }

            if (
                req.topUpRequest.createdBy.toString() !==
                req.user._id.toString()
            ) {
                const error = new Error("not authorized");
                res.status(401).json({ message: error.message });
                return;
            }

            const affiliate = req.user;
            affiliate.topUpRequests.filter(
                (topUpRequest) => topUpRequest._id.toString() !== topUpRequestId
            );

            await Promise.allSettled([
                req.topUpRequest.deleteOne(),
                affiliate.save(),
            ]);

            res.status(200).json({
                message: "Top-up request deleted successfully",
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "There's been an error" });
        }
    };

    static updateTopUpRequestStatus = async (
        req: Request<TopUpRequestParams, {}, TopUpRequestStatusType>,
        res: Response
    ) => {
        const affiliateId = req.topUpRequest.createdBy;
        const topUpRequestId = req.topUpRequest._id;

        try {
            if (!isManager(req.user)) {
                const error = new Error("Invalid action");
                res.status(401).json({ message: error.message });
                return;
            }

            const affiliate = await Affiliate.findById(affiliateId);

            const isAuthorized =
                affiliate.manager.toString() === req.user._id.toString();
            if (!isAuthorized) {
                const error = new Error("Not authorized");
                res.status(401).json({ message: error.message });
                return;
            }

            const topUpRequest = await TopUpRequest.findById(topUpRequestId);
            topUpRequest.status = req.body.status;
            await topUpRequest.save();

            //send notification email
            NotificationEmail.topUpRequestUpdatedEmail({
                email: affiliate.email,
                name: affiliate.name,
                topUpRequestStatus: topUpRequest.status,
            });

            // create frontend notification
            if (affiliate) {
                const notification = new Notification({
                    message: `Your top up request has been ${topUpRequest.status}`,
                    recipient: affiliateId,
                    recipientModel: "Affiliate",
                    status: notificationStatus.UNREAD,
                    link: `${process.env.FRONTEND_URL}/top-up-requests`,
                });
                await notification.save();
            } else {
                console.warn("Affiliate not found for notification.");
            }

            res.status(200).json({
                message: "Top-up request status updated successfully",
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "There's been an error" });
        }
    };
}

export default TopUpRequestsController;
