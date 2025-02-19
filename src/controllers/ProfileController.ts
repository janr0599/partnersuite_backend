import { Request, Response } from "express";
import { isAffiliate, isManager, UserType } from "../types/User";
import Manager from "../models/Manager";
import Affiliate from "../models/Affiliate";
import { checkPassword, hashPassword } from "../utils/auth";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../config/cloudinary";
import formidable from "formidable";

export class ProfileController {
    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body;
        try {
            let user: UserType;

            // Determine if the user is a manager or an affiliate
            if (isManager(req.user)) {
                // Check if the email is already in use by another manager
                const emailUsedByManager = await Manager.findOne({ email });
                if (
                    emailUsedByManager &&
                    req.user._id.toString() !==
                        emailUsedByManager._id.toString()
                ) {
                    const error = new Error("Email already in use");
                    res.status(404).json({ error: error.message });
                    return;
                }
                user = await Manager.findById(req.user._id);
            } else if (isAffiliate(req.user)) {
                // Check if the email is already in use by another affiliate
                const emailUsedByAffiliate = await Affiliate.findOne({ email });
                if (
                    emailUsedByAffiliate &&
                    req.user._id.toString() !==
                        emailUsedByAffiliate._id.toString()
                ) {
                    const error = new Error("Email already in use");
                    res.status(404).json({ error: error.message });
                    return;
                }
                user = await Affiliate.findById(req.user._id);
            }

            if (user) {
                user.name = name;
                user.email = email;
                await user.save();
                res.status(200).json({
                    message: "Profile updated successfully",
                });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "There's been an error" });
        }
    };

    static changeCurrentPassword = async (req: Request, res: Response) => {
        const { currentPassword, password } = req.body;

        try {
            let user: UserType;

            // Determine if the user is a manager or an affiliate
            if (isManager(req.user)) {
                user = await Manager.findById(req.user._id);
            } else if (isAffiliate(req.user)) {
                user = await Affiliate.findById(req.user._id);
            }

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const isPasswordCorrect = await checkPassword(
                currentPassword,
                user.password
            );

            if (!isPasswordCorrect) {
                const error = new Error("Current password is incorrect");
                res.status(400).json({ error: error.message });
                return;
            }

            user.password = await hashPassword(password);
            await user.save();

            res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
            res.status(500).json({ message: "There's been an error" });
        }
    };

    static async uploadImage(req: Request, res: Response) {
        const form = formidable({ multiples: false });

        try {
            form.parse(req, (err, fields, files) => {
                cloudinary.uploader.upload(
                    files.file[0].filepath,
                    { public_id: uuidv4() },
                    async function (error, result) {
                        if (error) {
                            const error = new Error("Invalid action");
                            res.status(401).json({ error: error.message });
                            return;
                        }
                        if (result) {
                            if (isManager(req.user)) {
                                const manager = await Manager.findById(
                                    req.user.id
                                );
                                manager.image = result.secure_url;
                                await manager.save();
                            } else {
                                const affiliate = await Affiliate.findById(
                                    req.user.id
                                );
                                affiliate.image = result.secure_url;
                                await affiliate.save();
                            }
                            res.json({ image: result.secure_url });
                        }
                    }
                );
            });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    }
}
