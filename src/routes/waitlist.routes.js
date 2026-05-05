// src/routes/waitlist.routes.js

import express from "express";
import { 
  joinWaitlist, 
  getWaitlist, 
  deleteWaitlistEntry 
} from "../controllers/waitlist.controller.js";

const router = express.Router();

// POST → join waitlist
router.post("/", joinWaitlist);

// GET → fetch all waitlist users
router.get("/", getWaitlist);

// DELETE → remove waitlist user
router.delete("/:id", deleteWaitlistEntry);

export default router;