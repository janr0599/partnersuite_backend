import { Request, Response } from "express";
import Ticket from "../models/Ticket";
import Affiliate from "../models/Affiliate";
import { isAffiliate, isManager } from "../types/User";
import Manager from "../models/Manager";
import { subDays, startOfDay, endOfDay } from "date-fns";

class TicketsController {
    static createTicket = async (req: Request, res: Response) => {
        const affiliateId = req.user._id;
        try {
            if (!isAffiliate(req.user)) {
                const error = new Error("Invalid action");
                res.status(401).json({ error: error.message });
                return;
            }

            const affiliate = await Affiliate.findById(affiliateId).populate(
                "manager"
            );

            if (!affiliate) {
                const error = new Error("Affiliate not found");
                res.status(404).json({ error: error.message });
                return;
            }

            const managerID = affiliate.manager._id;

            const ticket = new Ticket({
                ...req.body,
                createdBy: affiliateId,
                manager: managerID,
            });

            affiliate.tickets.push(ticket._id);

            Promise.allSettled([affiliate.save(), ticket.save()]);

            res.status(201).json({ message: "Ticket created successfully" });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static getTickets = async (req: Request, res: Response) => {
        try {
            let query = {};

            if (isManager(req.user)) {
                // Fetch the manager affiliates
                const manager = await Manager.findById(req.user.id).populate(
                    "affiliates"
                );
                const affiliateIds = manager.affiliates.map(
                    (affiliate) => affiliate.id
                );
                query = {
                    createdBy: { $in: affiliateIds },
                };
            } else if (isAffiliate(req.user)) {
                query = {
                    createdBy: req.user.id,
                };
            }
            console.log(query);
            const tickets = await Ticket.find(query).populate(
                "createdBy",
                "-password"
            );
            res.status(200).json({ tickets: tickets });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static getPreviousDayTickets = async (req: Request, res: Response) => {
        try {
            const previousDay = subDays(new Date(), 1);
            const start = startOfDay(previousDay);
            const end = endOfDay(previousDay);
            const tickets = await Ticket.find({
                createdAt: { $gte: start, $lte: end },
            });
            res.status(200).json({ tickets: tickets });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static getLatestTickets = async (req: Request, res: Response) => {
        try {
            let query = {};

            if (!isManager(req.user)) {
                const error = new Error("Invalid action");
                res.status(401).json({ error: error.message });
                return;
            }

            // Fetch the manager affiliates
            const manager = await Manager.findById(req.user.id).populate(
                "affiliates"
            );
            const affiliateIds = manager.affiliates.map(
                (affiliate) => affiliate.id
            );
            query = {
                status: { $in: ["open"] },
                createdBy: { $in: affiliateIds },
            };

            const tickets = await Ticket.find(query)
                .limit(5)
                .populate("createdBy", "-password");

            res.status(200).json({ tickets: tickets });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static getTicketById = async (req: Request, res: Response) => {
        try {
            const ticket = await Ticket.findById(req.ticket._id)
                .populate({
                    path: "comments",
                    populate: {
                        path: "createdBy",
                        select: "-password",
                    },
                })
                .populate({
                    path: "createdBy",
                    select: "-password",
                });

            res.status(200).json({ ticket: ticket });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static updateTicket = async (req: Request, res: Response) => {
        try {
            if (!isAffiliate(req.user)) {
                const error = new Error("Invalid action");
                res.status(401).json({ error: error.message });
                return;
            }

            const isAuthorized =
                req.ticket.createdBy.toString() === req.user._id.toString();

            if (!isAuthorized) {
                const error = new Error("Not authorized");
                res.status(401).json({ error: error.message });
                return;
            }

            req.ticket.title = req.body.title;
            req.ticket.description = req.body.description;
            req.ticket.category = req.body.category;

            await req.ticket.save();
            res.status(200).json({
                message: "Ticket updated successfully",
            });
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
            if (req.body.status === "closed") {
                ticket.closedAt = new Date();
            }
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
