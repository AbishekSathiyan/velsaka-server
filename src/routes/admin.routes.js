import express from "express";
import {
  getWaitlistUsers,
  deleteWaitlistUser,
  clearWaitlist,
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyAdmin);

router.get("/waitlist", getWaitlistUsers);
router.delete("/waitlist/:id", deleteWaitlistUser);
router.delete("/waitlist", clearWaitlist);

export default router;
