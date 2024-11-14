import { Request, Response } from "express";
import User, { roles } from "../models/User";
import { hashPassword } from "../utils/auth";

class AffiliatesController {
    static addAffiliate = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (req.user.role !== roles.manager) {
                res.status(403).json({ message: "You are not authorized" });
                return;
            }

            const affiliateExists = await User.findOne({ email });

            if (affiliateExists) {
                const error = new Error("Affiliate already exists");
                res.status(400).json({ message: error.message });
                return;
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Create new user
            const newAffiliate = new User({
                ...req.body,
                password: hashedPassword,
                role: roles.affiliate,
                manager: req.user._id,
            });

            req.user.affiliates.push(newAffiliate._id);

            await Promise.allSettled([newAffiliate.save(), req.user.save()]);

            res.status(201).json({
                message: "Affiliate account created successfully",
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "There's been an error" });
        }
    };
}

export default AffiliatesController;
