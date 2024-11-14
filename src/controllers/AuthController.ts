import { Request, Response } from "express";
import User, { roles } from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            // Prevent duplicate emails
            const userExists = await User.findOne({ email });
            if (userExists) {
                const error = new Error("Email already exists");
                res.status(409).json({ message: error.message });
                return;
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Crate new user
            const newManager = new User({
                ...req.body,
                password: hashedPassword,
                role: roles.manager,
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
            const user = await User.findOne({ email });

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

            const token = generateJWT({ id: user.id });

            res.json({ token: token });
        } catch (error) {
            res.status(500).json({ error: "there's been an error" });
        }
    };
}

export default AuthController;
