import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { otpStore } from "../utils/otpStore.js";
import { sendMail } from "../services/mail.service.js";

export const sendAdminOTP = async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore.otp = otp;
  otpStore.expiresAt = Date.now() + 5 * 60 * 1000;

  await sendMail({
    to: ENV.ADMIN_EMAIL,
    subject: "Admin OTP",
    html: `<h2>${otp}</h2>`,
  });

  res.json({ success: true });
};

export const verifyAdminOTP = (req, res) => {
  const { otp } = req.body;

  if (Date.now() > otpStore.expiresAt)
    return res.status(400).json({ success: false });

  if (Number(otp) !== otpStore.otp)
    return res.status(400).json({ success: false });

  const token = jwt.sign(
    { role: "admin" },
    ENV.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ success: true, token });
};