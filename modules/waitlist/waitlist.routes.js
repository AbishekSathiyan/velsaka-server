import express from "express";
import { addToWaitlist, getWaitlist } from "./waitlist.controller.js";

const router = express.Router();

// 🔗 REST style route
router.route("/")
  .post(addToWaitlist)
  .get(getWaitlist);

export default router;