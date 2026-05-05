import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function testEmail() {
  try {
    // 🔍 verify connection
    await transporter.verify();
    console.log("✅ SMTP is ready");

    // 📩 send test mail
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "quotes.abi@gmail.com", // send to yourself
      subject: "Test Email from Node",
      text: "Hello Abishek, email working ✅",
    });

    console.log("📨 Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email error:", error);
  }
}

testEmail();
