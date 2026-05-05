import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

let transporter;

const createTransporter = () => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Email credentials missing");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};

const getTransporter = async () => {
  if (!transporter) {
    transporter = createTransporter();
    await transporter.verify();
    console.log("✅ SMTP Ready");
  }
  return transporter;
};

/**
 * ✅ Waitlist Email
 */
export const sendWaitlistEmail = async (to, html) => {
  try {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: `"VELSAKA TECH" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to VELSAKA 🚀",
      html,
    });

    console.log("✅ Waitlist mail sent:", info.response);

    return { success: true };
  } catch (err) {
    console.error("❌ Mail error:", err.message);
    return { success: false };
  }
};

/**
 * ✅ OTP Email (FIX for your error)
 */
export const sendOTPEmail = async (to, otp) => {
  try {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: `"VELSAKA TECH" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Admin Login OTP",
      html: `<h2>Your OTP: ${otp}</h2>`,
    });

    console.log("✅ OTP sent:", info.response);

    return { success: true };
  } catch (err) {
    console.error("❌ OTP error:", err.message);
    return { success: false };
  }
};