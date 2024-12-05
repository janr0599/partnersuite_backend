import { Schema, model, Types } from "mongoose";
import { TicketType } from "../types/Tickets";
import Comment from "./Comment";

export const ticketStatus = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    CLOSED: "closed",
} as const;

export const ticketCategory = {
    BONUS: "bonus",
    WITHDRAWAl: "withdrawal",
    ACCOUNT: "account",
    PAYMENT: "payment",
    GENERAL_QUESTION: "general_question",
} as const;

const TicketSchema: Schema = new Schema(
    {
        ticketId: {
            type: String,
            unique: true,
            required: true,
        },
        title: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            required: true,
        },
        category: {
            type: String,
            enum: Object.values(ticketCategory),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(ticketStatus),
            default: ticketStatus.OPEN,
        },
        createdBy: {
            type: Types.ObjectId,
            ref: "Affiliate",
        },
        manager: {
            type: Types.ObjectId,
            ref: "Manager",
        },
        comments: [
            {
                type: Types.ObjectId,
                ref: "Comment",
            },
        ],
        closedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Middleware to delete ticket comments when ticket is deleted
TicketSchema.pre("deleteOne", { document: true }, async function () {
    const ticketId = this._id;
    if (!ticketId) return;
    await Comment.deleteMany({ ticket: ticketId });
});

const Ticket = model<TicketType>("Ticket", TicketSchema);
export default Ticket;
