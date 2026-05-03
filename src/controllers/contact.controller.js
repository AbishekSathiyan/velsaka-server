import Contact from "../models/contact.model.js";
import { sendMail } from "../services/mail.service.js";

export const createContact = async (req, res) => {
  try {
    const { fullName, email, phone, service, message } = req.body;

    // validation
    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // save DB
    const contact = await Contact.create({
      fullName,
      email,
      phone: phone || "",
      service: service || "Web Development",
      message,
    });

    // email (don’t crash API if mail fails)
    sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Request</h2>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Service:</b> ${service || "Web Development"}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    }).catch((err) => {
      console.error("MAIL ERROR:", err.message);
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });

  } catch (err) {
    console.error("CONTACT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};