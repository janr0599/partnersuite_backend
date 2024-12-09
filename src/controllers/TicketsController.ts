import { Request, Response } from "express";
import Ticket from "../models/Ticket";
import Affiliate from "../models/Affiliate";
import { isAffiliate, isManager } from "../types/User";
import Manager from "../models/Manager";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../config/cloudinary";
import formidable from "formidable";

class TicketsController {
    static createTicket = async (req: Request, res: Response) => {
        const affiliateId = req.user._id;

        let ticketFile = "";

        if (req.body.file) {
            ticketFile = req.body.file;
        }

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
                ticketId: `T-${uuidv4().slice(0, 8)}`, // Generate unique ticket ID
                file: ticketFile,
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
            const tickets = await Ticket.find(query)
                .populate("createdBy", "-password")
                .sort({ createdAt: "desc" });
            res.status(200).json({ tickets: tickets });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    };

    static getPreviousDayTickets = async (req: Request, res: Response) => {
        try {
            // Get the current date and subtract 1 day
            const now = new Date();
            const previousDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - 1
            );

            // Get the start and end times for the previous day
            const start = new Date(previousDay.setHours(0, 0, 0, 0));
            const end = new Date(previousDay.setHours(23, 59, 59, 999));

            // Query for tickets created within the range
            const tickets = await Ticket.find({
                createdAt: { $gte: start, $lte: end },
            });

            res.status(200).json({ tickets });
        } catch (error) {
            res.status(500).json({ message: "There's been an error" });
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
                .populate("createdBy", "-password")
                .sort({ createdAt: "desc" });

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

    static async uploadFile(req: Request, res: Response) {
        const form = formidable({ multiples: false });

        try {
            form.parse(req, (err, fields, files) => {
                cloudinary.uploader.upload(
                    files.file[0].filepath,
                    { public_id: uuidv4() },
                    async function (error, result) {
                        if (error) {
                            const error = new Error("Invalid action");
                            res.status(401).json({ error: error.message });
                            return;
                        }
                        if (result) {
                            res.json({ image: result.secure_url });
                        }
                    }
                );
            });
        } catch (error) {
            res.status(500).json({ message: "there's been an error" });
        }
    }
}

export default TicketsController;
