import { Request, Response } from "express";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import Manager from "../models/Manager";
import Affiliate from "../models/Affiliate";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { TokenType } from "../types/Token";
import { sendTokenEmail } from "../emails/TokenEmail";

class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            // Prevent duplicate emails
            const ManagerExists = await Manager.findOne({ email });
            if (ManagerExists) {
                const error = new Error("Email already exists");
                res.status(409).json({ error: error.message });
                return;
            }

            const AffiliateExists = await Affiliate.findOne({ email });
            if (AffiliateExists) {
                const error = new Error("Email already exists");
                res.status(409).json({ error: error.message });
                return;
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Crate new user
            const newManager = new Manager({
                ...req.body,
                password: hashedPassword,
                affiliates: [],
            });

            await newManager.save();
            res.status(201).json({ message: "Account created successfully" });
        } catch (error) {
            res.status(500).json({ message: "There's been an error" });
        }
    };

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            let user = await Manager.findOne({ email });
            if (!user) {
                user = await Affiliate.findOne({ email });
            }

            // Confirm user
            if (!user) {
                const error = new Error("User not found");
                res.status(404).json({ error: error.message });
                return;
            }

            // Check password match
            const isCorrectPassword = await checkPassword(
                password,
                user.password
            );
            if (!isCorrectPassword) {
                const error = new Error("Incorrect password");
                res.status(401).json({ error: error.message });
                return;
            }

            const token = generateJWT({ id: user.id, role: user.role });

            res.json({ token: token });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static user = async (req: Request, res: Response) => {
        res.status(200).json({ user: req.user });
    };

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // Check if user Exists
            const userExists = async () => {
                const affiliate = await Affiliate.findOne({ email });
                if (affiliate) {
                    return { user: affiliate, model: "Affiliate" };
                }
                const manager = await Manager.findOne({ email });
                if (manager) {
                    return { user: manager, model: "Manager" };
                }
                return null;
            };

            const result = await userExists();

            if (!result) {
                const error = new Error("User not found");
                res.status(404).json({ error: error.message });
                return;
            }

            const { user, model } = result;

            // Generate token
            const token = new Token();
            token.token = generateToken();
            token.recipient = user._id;
            token.recipientModel = model as "Affiliate" | "Manager";
            await token.save();

            // Send confirmation email
            sendTokenEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });

            res.status(200).json({
                message:
                    "We have sent you an email with instructions to reset your password",
            });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;
            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                const error = new Error("Invalid Token");
                res.status(404).json({ error: error.message });
                return;
            }

            res.status(200).json({
                message: "Confirmed, set a new password",
            });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                const error = new Error("Invalid Token");
                res.status(404).json({ error: error.message });
                return;
            }

            // Check if user Exists
            const userExists = async () => {
                const affiliate = await Affiliate.findById(
                    tokenExists.recipient
                );
                if (affiliate) {
                    return { user: affiliate };
                }
                const manager = await Manager.findById(tokenExists.recipient);
                if (manager) {
                    return { user: manager };
                }
                return null;
            };

            const result = await userExists();

            if (!result) {
                const error = new Error("User not found");
                res.status(404).json({ error: error.message });
                return;
            }

            const { user } = result;
            user.password = await hashPassword(password);

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
            res.status(200).json({
                message: "New password successfully set",
            });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };
}

export default AuthController;
