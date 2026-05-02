import express from "express";
import {
  sendAdminOTP,
  verifyAdminOTP,
} from "../controllers/auth.controller.js";
import { otpLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/admin/send-otp", otpLimiter, sendAdminOTP);
router.post("/admin/verify-otp", verifyAdminOTP);

export default router;