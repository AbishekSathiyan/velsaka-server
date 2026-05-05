import express from "express";
import {
  sendOTP,
  verifyOTPAndLogin,
  resendOTP,
  getAdminProfile,
  logout,
} from "../controllers/adminAuth.controller.js";

import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTPAndLogin);
router.post("/resend-otp", resendOTP);

router.get("/me", protect, authorize("admin"), getAdminProfile);
router.post("/logout", protect, authorize("admin"), logout);

export default router;