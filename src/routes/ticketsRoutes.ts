import { Router } from "express";
import TicketsController from "../controllers/TicketsController";
import {
    validateTicketData,
    validateTicketExists,
} from "../middleware/ticketsMiddleware";
import { validateObjectId } from "../middleware/validationMiddleware";
import CommentsRoutes from "./commentsRoutes";

const router = Router();

router.param("ticketId", validateObjectId);
router.param("ticketId", validateTicketExists);

router.post("/", validateTicketData, TicketsController.createTicket);
router.get("/", TicketsController.getTickets);
router.get("/:ticketId", TicketsController.getTicketById);
router.patch("/:ticketId", TicketsController.updateTicketStatus);
router.delete("/:ticketId", TicketsController.deleteTicket);

// Comments Routes
router.use("/:ticketId/comments", CommentsRoutes);

export default router;
