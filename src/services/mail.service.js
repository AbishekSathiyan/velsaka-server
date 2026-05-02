import { transporter } from "../config/mail.js";
import { ENV } from "../config/env.js";

export const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: ENV.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("✅ Mail sent:", to);
  } catch (err) {
    console.error("❌ Mail error:", err.message);
  }
};