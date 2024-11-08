import z from "zod";

export const ticketSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    category: z.enum(
        ["bonus", "withdrawal", "account", "payment", "general_question"],
        { message: "Ticket category is required" }
    ),
});
