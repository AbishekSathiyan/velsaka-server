// src/controllers/adminAuth.controller.js

import { sendOTPEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

const otpStore = new Map();

// Store for blacklisted tokens (optional, for better security)
const tokenBlacklist = new Set();

/**
 * ✅ CLEANUP EXPIRED OTPs
 */
setInterval(() => {
  const now = new Date();
  for (const [email, data] of otpStore.entries()) {
    if (data.expiry < now) {
      otpStore.delete(email);
    }
  }
}, 5 * 60 * 1000);

/**
 * ✅ SEND OTP
 */
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, {
      otp,
      expiry: new Date(Date.now() + 10 * 60000),
    });

    const emailResult = await sendOTPEmail(email, otp);

    // FIXED: Never send OTP in response (production or dev)
    return res.json({
      success: true,
      message: emailResult.success
        ? "OTP sent to your email"
        : "OTP generated (email failed)",
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * ✅ VERIFY OTP + LOGIN
 */
export const verifyOTPAndLogin = (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required",
      });
    }

    const data = otpStore.get(email);

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "No OTP found",
      });
    }

    if (new Date() > data.expiry) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (data.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    otpStore.delete(email);

    const token = jwt.sign(
      { email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      data: { token, email },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * ✅ RESEND OTP
 */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, {
      otp,
      expiry: new Date(Date.now() + 10 * 60000),
    });

    const emailResult = await sendOTPEmail(email, otp);

    // FIXED: Never send OTP in response (production or dev)
    return res.json({
      success: true,
      message: emailResult.success
        ? "OTP resent to your email"
        : "OTP generated (email failed)",
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * ✅ GET ADMIN PROFILE
 */
export const getAdminProfile = (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        email: req.user?.email,
        role: req.user?.role || "admin",
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * ✅ LOGOUT (NEW)
 */
export const logout = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    // Optional: Add token to blacklist
    if (token) {
      tokenBlacklist.add(token);
    }

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * ✅ CHECK IF TOKEN IS BLACKLISTED (for middleware)
 */
export const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};