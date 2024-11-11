import z from "zod";

export const commentSchema = z.object({
    content: z.string().trim().min(1, "The comment cannot be empty"),
});
