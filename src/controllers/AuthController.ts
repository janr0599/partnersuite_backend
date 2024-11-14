import { Request, Response } from "express";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import Manager from "../models/Manager";
import Affiliate from "../models/Affiliate";

class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            // Prevent duplicate emails
            const userExists = await Manager.findOne({ email });
            if (userExists) {
                const error = new Error("Email already exists");
                res.status(409).json({ message: error.message });
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
            res.status(500).json({ error: "there's been an error" });
        }
    };
}

export default AuthController;
