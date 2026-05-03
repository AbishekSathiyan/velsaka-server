// src/controllers/adminAuth.controller.js
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

// Store OTPs temporarily
const otpStore = new Map();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Login OTP - VELSAKA TECH</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
          line-height: 1.6;
          background: #f4f6f8;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          text-align: center;
        }
        .logo {
          font-size: 24px;
          font-weight: 800;
          color: white;
        }
        .content {
          padding: 30px;
          text-align: center;
        }
        .otp-code {
          font-size: 36px;
          font-weight: 800;
          color: #667eea;
          letter-spacing: 8px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          margin: 20px 0;
          font-family: monospace;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">VELSAKA TECH</div>
          <div style="font-size: 12px; opacity: 0.8;">Admin Login Verification</div>
        </div>
        <div class="content">
          <h2>Your Login OTP</h2>
          <p>Use the following OTP to login to your admin account. This OTP is valid for 10 minutes.</p>
          <div class="otp-code">${otp}</div>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} VELSAKA TECH. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"VELSAKA TECH Admin" <${ENV.EMAIL_USER}>`,
    to: email,
    subject: "Admin Login OTP - VELSAKA TECH",
    html: emailTemplate,
    text: `Your OTP for admin login is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
  });
};

// @desc    Send OTP to admin email
export const sendOTP = async (req, res) => {
  console.log("📧 Send OTP request received");
  console.log("Request email:", req.body.email);

  try {
    const { email } = req.body;
    const adminEmail = ENV.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error("ADMIN_EMAIL not set in .env");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    if (email !== adminEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
    });

    await sendOTPEmail(email, otp);
    console.log(`✅ OTP sent to ${email}`);

    res.json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
    });
  }
};

// @desc    Verify OTP and login
export const verifyOTPAndLogin = async (req, res) => {
  console.log("🔐 Verify OTP request received");

  try {
    const { email, otp } = req.body;
    const adminEmail = ENV.ADMIN_EMAIL;

    if (email !== adminEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    if (storedData.attempts >= 3) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    if (storedData.otp !== otp) {
      storedData.attempts++;
      otpStore.set(email, storedData);
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining.`,
      });
    }

    // Generate token with proper secret
    console.log(
      "Generating JWT with secret:",
      ENV.JWT_SECRET ? "Secret exists" : "Secret missing",
    );

    const token = jwt.sign(
      { id: "admin_001", email: email, role: "admin" },
      ENV.JWT_SECRET,
      { expiresIn: "30s" },
    );

    otpStore.delete(email);
    console.log(`✅ Login successful for ${email}`);
    console.log(`Token generated: ${token.substring(0, 50)}...`);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: "admin_001",
        email: email,
        name: "Admin",
        role: "super_admin",
        token: token,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// @desc    Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    console.log("Getting admin profile for:", req.admin);
    res.json({
      success: true,
      data: {
        id: req.admin.id,
        email: req.admin.email,
        name: "Admin",
        role: "super_admin",
      },
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const adminEmail = ENV.ADMIN_EMAIL;

    if (email !== adminEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const otp = generateOTP();

    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
    });

    await sendOTPEmail(email, otp);
    console.log(`New OTP sent to ${email}: ${otp}`);

    res.json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
    });
  }
};
