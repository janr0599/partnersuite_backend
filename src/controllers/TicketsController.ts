import { Request, Response } from "express";
import Ticket from "../models/Ticket";

class TicketsController {
    static createTicket = async (req: Request, res: Response) => {
        const ticket = new Ticket(req.body);
        try {
            await ticket.save();
            res.status(201).json({ message: "Ticket created successfully" });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };
    static getTickets = async (req: Request, res: Response) => {
        try {
            const tickets = await Ticket.find();
            res.status(200).json({ tickets: tickets });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static getTicketById = async (req: Request, res: Response) => {
        try {
            const ticket = await Ticket.findById(req.ticket._id).populate({
                path: "comments",
            });

            res.status(200).json({ ticket: ticket });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };
    static deleteTicket = async (req: Request, res: Response) => {
        try {
            const ticket = await Ticket.findById(req.ticket._id);
            await ticket.deleteOne();
            res.status(200).json({ message: "Ticket deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static updateTicketStatus = async (req: Request, res: Response) => {
        try {
            const ticket = await Ticket.findById(req.ticket._id);
            ticket.status = req.body.status;
            await ticket.save();
            res.status(200).json({
                message: "Ticket status updated successfully",
            });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };
}

export default TicketsController;
