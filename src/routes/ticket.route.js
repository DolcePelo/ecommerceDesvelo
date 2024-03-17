import { Router } from "express";
import { getTickets, getTicketById, createTicket, resolveTicket } from "../controller/ticket.controller.js";

const router = Router();

router.get("/", getTickets);
router.get("/:id", getTicketById);
router.post("/", createTicket);
router.put("/:id", resolveTicket);

export default router;