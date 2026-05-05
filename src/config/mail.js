import nodemailer from "nodemailer";
import dns from "dns";

// ✅ Force IPv4 (Render fix)
dns.setDefaultResultOrder("ipv4first");

// ========================
// FORCE STABLE GMAIL CONFIG
// ========================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,          // ✅ BEST for cloud servers
  secure: true,       // ✅ MUST be true for 465

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },

  connectionTimeout: 30000,
  socketTimeout: 30000,
});