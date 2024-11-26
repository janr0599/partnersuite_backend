import { Document, Types } from "mongoose";
import { ticketCategory, ticketStatus } from "../models/Ticket";

export type TicketStatus = (typeof ticketStatus)[keyof typeof ticketStatus];
export type TicketCategory =
    (typeof ticketCategory)[keyof typeof ticketCategory];

export type TicketType = Document & {
    title: string;
    description: string;
    status: TicketStatus;
    category: TicketCategory;
    createdBy: Types.ObjectId;
    manager: Types.ObjectId;
    comments: Types.ObjectId[];
    closedAt: Date | null;
    _id: Types.ObjectId;
};
