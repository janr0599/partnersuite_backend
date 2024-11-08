import { Router } from "express";
import TicketsController from "../controllers/TicketsController";
import {
    validateTicketData,
    validateTicketExists,
} from "../middleware/ticketsMiddleware";
import { validateObjectId } from "../middleware/validationMiddleware";

const router = Router();

router.param("ticketId", validateObjectId);
router.param("ticketId", validateTicketExists);

router.post("/", validateTicketData, TicketsController.createTicket);
router.get("/", TicketsController.getTickets);
router.get("/:ticketId", TicketsController.getTicketById);
router.delete("/:ticketId", TicketsController.deleteTicket);

export default router;
