// src/routes/adminAuth.routes.js
import express from "express";
import {
  sendOTP,
  verifyOTPAndLogin,
  getAdminProfile,
  resendOTP,
} from "../controllers/adminAuth.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTPAndLogin);
router.post("/resend-otp", resendOTP);

// Protected routes
router.get("/me", protectAdmin, getAdminProfile);

// Test route
router.get("/", (req, res) => {
  res.json({ success: true, message: "Admin auth routes working!" });
});

export default router;
