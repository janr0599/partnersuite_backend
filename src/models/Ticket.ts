import { Schema, model, Types } from "mongoose";
import { TicketType } from "../types/Tickets";

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
        // owner: {
        //     type: Types.ObjectId,
        //     ref: "User",
        // },
        //manager: {
        //     type: Types.ObjectId,
        //     ref: "User",
        // },
        // comments: [
        //     {
        //         type: Types.ObjectId,
        //         ref: "Comment",
        //     },
        // ],
    },
    { timestamps: true }
);

const Ticket = model<TicketType>("Ticket", TicketSchema);
export default Ticket;
