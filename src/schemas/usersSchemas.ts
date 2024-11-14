import z from "zod";

export const userSchema = z.object({
    name: z.string().trim().min(1, "The name cannot be empty"),
    email: z
        .string()
        .trim()
        .min(1, "The email cannot be empty")
        .email("invalid email"),
    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().trim().min(1, "Please confirm your password"),
});

export const registrationSchema = userSchema
    .pick({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // Specify the path to show the error message
    });

export const loginSchema = userSchema
    .pick({
        email: true,
        password: true,
    })
    .extend({
        password: z.string().trim().min(1, "Password is required"),
    });