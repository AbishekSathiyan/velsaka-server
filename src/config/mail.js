// backend/config/email.js
import nodemailer from "nodemailer";
import dns from "dns";

// ✅ Force IPv4 (fixes Render issue)
dns.setDefaultResultOrder("ipv4first");

const PORT = parseInt(process.env.EMAIL_PORT) || 587;

// ✅ Auto secure handling
const isSecure = PORT === 465;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: PORT,
  secure: isSecure, // ✅ correct mapping

  requireTLS: !isSecure, // ✅ enforce TLS for 587

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  family: 4, // ✅ force IPv4

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});