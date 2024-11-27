import { Router } from "express";
import TicketsController from "../controllers/TicketsController";
import {
    validateTicketData,
    validateTicketExists,
} from "../middleware/ticketsMiddleware";
import { validateObjectId } from "../middleware/validationMiddleware";
import CommentsRoutes from "./commentsRoutes";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

router.param("ticketId", validateObjectId);
router.param("ticketId", validateTicketExists);

router.post("/", validateTicketData, TicketsController.createTicket);
router.get("/", TicketsController.getTickets);
router.get("/previousDayTickets", TicketsController.getPreviousDayTickets);
router.get("/latestTickets", TicketsController.getLatestTickets);
router.get("/:ticketId", TicketsController.getTicketById);
router.put("/:ticketId", validateTicketData, TicketsController.updateTicket);
router.patch("/:ticketId", TicketsController.updateTicketStatus);
router.delete("/:ticketId", TicketsController.deleteTicket);

// Comments Routes
router.use("/:ticketId/comments", CommentsRoutes);

export default router;
