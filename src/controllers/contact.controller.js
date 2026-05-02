import Contact from "../models/contact.model.js";
import { sendMail } from "../services/mail.service.js";

export const createContact = async (req, res) => {
  try {
    const { fullName, email, phone, service, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const contact = await Contact.create({
      fullName,
      email,
      phone,
      service,
      message,
    });

    // 📩 Admin notification email
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Request</h2>
        <p><b>Name:</b> ${fullName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Admin - Get all contacts
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: contacts,
    });
  } catch {
    res.status(500).json({ success: false });
  }
};

// Admin - Delete contact
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted",
    });
  } catch {
    res.status(500).json({ success: false });
  }
};