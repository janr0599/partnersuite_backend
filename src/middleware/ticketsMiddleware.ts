import { Request, Response, NextFunction } from "express";
import { ticketSchema } from "../schemas/ticketsSchemas";
import { TicketType } from "../types/Tickets";
import Ticket from "../models/Ticket";

declare global {
    namespace Express {
        interface Request {
            ticket: TicketType;
        }
    }
}

export const validateTicketData = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validation = ticketSchema.safeParse(req.body);

    if (!validation.success) {
        res.status(400).json(validation.error.issues);
        return;
    }

    next();
};

export const validateTicketExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { ticketId } = req.params;

    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            res.status(404).json({ error: "Ticket not found" });
            return;
        }

        req.ticket = ticket;

        next();
    } catch (error) {
        res.status(500).json({ error: "there's been an error" });
    }
};
