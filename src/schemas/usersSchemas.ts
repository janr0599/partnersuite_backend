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
    status: z.enum(["active", "inactive"]),
    platform: z.string().trim().min(1, "Platform cannot be empty"),
    contractType: z.enum(["CPA", "RevShare", "Hybrid"]),
    BonusAmount: z.number().optional(),
    CPA: z.number().optional(),
    RevShare: z.number().optional(),
    Baseline: z.number().optional(),
});

export const managerRegistrationSchema = userSchema
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

export const affiliateRegistrationSchema = userSchema
    .pick({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
        platform: true,
        contractType: true,
        CPA: true,
        RevShare: true,
        Baseline: true,
    })
    .refine(
        (data) => {
            if (data.contractType === "CPA") {
                return data.CPA !== undefined;
            }
            return true;
        },
        { message: "CPA is required for CPA contract type", path: ["CPA"] }
    )
    .refine(
        (data) => {
            if (data.contractType === "RevShare") {
                return data.RevShare !== undefined;
            }
            return true;
        },
        {
            message: "RevShare is required for RevShare contract type",
            path: ["RevShare"],
        }
    )
    .refine(
        (data) => {
            if (data.contractType === "Hybrid") {
                return data.CPA !== undefined && data.RevShare !== undefined;
            }
            return true;
        },
        {
            message:
                "Both CPA and RevShare are required for Hybrid contract type",
            path: ["CPA", "RevShare"],
        }
    )
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // Specify the path to show the error message
    });

export const affiliateUpdateSchema = userSchema
    .pick({
        name: true,
        email: true,
        platform: true,
        contractType: true,
        BonusAmount: true,
        CPA: true,
        RevShare: true,
        Baseline: true,
    })
    .refine(
        (data) => {
            if (data.contractType === "CPA") {
                return data.CPA > 0;
            }
            return true;
        },
        { message: "CPA is required for CPA contract type", path: ["CPA"] }
    )
    .refine(
        (data) => {
            if (data.contractType === "RevShare") {
                return data.RevShare > 0;
            }
            return true;
        },
        {
            message: "RevShare is required for RevShare contract type",
            path: ["RevShare"],
        }
    )
    .refine(
        (data) => {
            if (data.contractType === "Hybrid") {
                return data.CPA > 0 && data.RevShare > 0;
            }
            return true;
        },
        {
            message:
                "Both CPA and RevShare are required for Hybrid contract type",
            path: ["CPA", "RevShare"],
        }
    );

export const affiliateUpdateStatusSchema = userSchema
    .pick({
        status: true,
    })
    .refine((data) => data.status === "active" || data.status === "inactive", {
        message: "Status must be active or inactive",
        path: ["status"],
    });

export const loginSchema = userSchema
    .pick({
        email: true,
        password: true,
    })
    .extend({
        password: z.string().trim().min(1, "Password is required"),
    });
