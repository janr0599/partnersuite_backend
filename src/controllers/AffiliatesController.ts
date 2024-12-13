import { Request, Response } from "express";
import { hashPassword } from "../utils/auth";
import Affiliate from "../models/Affiliate";
import { isManager } from "../types/User";
import { NotificationEmail } from "../emails/NotificationsEmail";

class AffiliatesController {
    static addAffiliate = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!isManager(req.user)) {
                res.status(403).json({ message: "You are not authorized" });
                return;
            }

            const affiliateExists = await Affiliate.findOne({ email });

            if (affiliateExists) {
                const error = new Error("Affiliate already exists");
                res.status(400).json({ message: error.message });
                return;
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Create new user
            const newAffiliate = new Affiliate({
                ...req.body,
                password: hashedPassword,
                manager: req.user._id,
            });

            req.user.affiliates.push(newAffiliate._id); // TypeScript now knows req.user is ManagerType

            await Promise.allSettled([newAffiliate.save(), req.user.save()]);

            // Send notification email
            NotificationEmail.affiliateAccountCreatedEmail({
                email: newAffiliate.email,
                name: newAffiliate.name,
            });

            res.status(201).json({
                message: "Affiliate account created successfully",
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "There's been an error" });
        }
    };

    static bulkAddAffiliates = async (req: Request, res: Response) => {
        try {
            const { affiliates } = req.body;

            if (!isManager(req.user)) {
                res.status(403).json({ message: "You are not authorized" });
                return;
            }

            const newAffiliates = await Promise.all(
                affiliates.map(async (affiliate) => {
                    const { email, password } = affiliate;

                    if (!isManager(req.user)) {
                        res.status(403).json({
                            message: "You are not authorized",
                        });
                        return;
                    }

                    const affiliateExists = await Affiliate.findOne({ email });
                    if (affiliateExists) {
                        throw new Error(
                            `Affiliate with email ${email} already exists`
                        );
                    }

                    const hashedPassword = await hashPassword(password);
                    const newAffiliate = new Affiliate({
                        ...affiliate,
                        password: hashedPassword,
                        manager: req.user._id,
                    });

                    req.user.affiliates.push(newAffiliate._id);

                    // Send notification email
                    NotificationEmail.affiliateAccountCreatedEmail({
                        email: newAffiliate.email,
                        name: newAffiliate.name,
                    });

                    return newAffiliate.save();
                })
            );

            await req.user.save();

            res.status(201).json({
                message: `${newAffiliates.length} affiliates added successfully`,
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({
                message: "An error occurred",
                error: error.message,
            });
        }
    };

    static getAffiliates = async (req: Request, res: Response) => {
        const managerId = req.user._id;
        try {
            if (!isManager(req.user)) {
                res.status(403).json({ message: "You are not authorized" });
                return;
            }

            // Get affiliates
            const affiliates = await Affiliate.find({
                manager: managerId,
            }).select("-password");

            res.status(200).json({ affiliates: affiliates });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "There's been an error" });
        }
    };

    static getAffiliateById = async (req: Request, res: Response) => {
        const affiliate = req.affiliate;

        try {
            if (affiliate.manager.toString() !== req.user._id.toString()) {
                const error = new Error("Invalid action");
                res.status(401).json({ error: error.message });
                return;
            }

            res.status(200).json({ affiliate: affiliate });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "There's been an error" });
        }
    };

    static updateAffiliate = async (req: Request, res: Response) => {
        const affiliate = req.affiliate;

        try {
            if (affiliate.manager.toString() !== req.user._id.toString()) {
                const error = new Error("Invalid action");
                res.status(401).json({ error: error.message });
                return;
            }

            // Check if email is being changed and if the new email already exists
            if (req.body.email && req.body.email !== affiliate.email) {
                const emailExists = await Affiliate.findOne({
                    email: req.body.email,
                });
                if (emailExists) {
                    res.status(400).json({ message: "Email already exists" });
                    return;
                }
            }

            affiliate.name = req.body.name;
            affiliate.email = req.body.email;
            affiliate.platform = req.body.platform;
            affiliate.contractType = req.body.contractType;
            affiliate.country = req.body.country;
            affiliate.BonusAmount = req.body.BonusAmount;
            affiliate.CPA = req.body.CPA;
            affiliate.RevShare = req.body.RevShare;

            await affiliate.save();

            res.status(200).json({
                message: "Affiliate updated successfully",
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "There's been an error" });
        }
    };

    static updateAffiliateStatus = async (req: Request, res: Response) => {
        const affiliate = req.affiliate;

        try {
            if (affiliate.manager.toString() !== req.user._id.toString()) {
                const error = new Error("Invalid action");
                res.status(401).json({ error: error.message });
                return;
            }

            affiliate.status = req.body.status;

            await affiliate.save();

            res.status(200).json({
                message: "Affiliate status updated successfully",
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "There's been an error" });
        }
    };

    static deleteAffiliate = async (req: Request, res: Response) => {
        const affiliate = req.affiliate;

        try {
            if (affiliate.manager.toString() !== req.user._id.toString()) {
                const error = new Error("Invalid action");
                res.status(401).json({ error: error.message });
                return;
            }

            if (isManager(req.user)) {
                req.user.affiliates = req.user.affiliates.filter(
                    (affiliate) =>
                        affiliate.toString() !== req.affiliate._id.toString()
                );
            }

            await Promise.allSettled([
                req.affiliate.deleteOne(),
                req.user.save(),
            ]);

            res.status(200).json({
                message: "Affiliate account deleted successfully",
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "There's been an error" });
        }
    };
}

export default AffiliatesController;
