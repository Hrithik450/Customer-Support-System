import express from "express";
import {
  fetchAgentTickets,
  newTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/raiseTicket", newTicket);
router.get("/fetchTickets/:agentID", fetchAgentTickets);

export default router;
