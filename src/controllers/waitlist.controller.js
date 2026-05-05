// src/controllers/waitlist.controller.js

import { createEmail, getAllEmails } from "../services/waitlist.service.js";
import { sendWaitlistEmail } from "../services/mail.service.js";
import { welcomeTemplate } from "../services/templates/welcome.template.js";
import Waitlist from "../models/waitlist.model.js"; // ✅ Add this import

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ✅ JOIN WAITLIST
export const joinWaitlist = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const result = await createEmail(email);

    if (result.isNew) {
      sendWaitlistEmail(email, welcomeTemplate(email)).catch((err) =>
        console.log("Mail error:", err.message),
      );
    }

    return res.status(201).json({
      success: true,
      message: result.isNew
        ? "Successfully joined waitlist"
        : "Already on waitlist",
      data: result.user,
    });
  } catch (err) {
    console.error("JOIN WAITLIST ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

// ✅ GET ALL WAITLIST
export const getWaitlist = async (req, res) => {
  try {
    const users = await getAllEmails();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error("GET WAITLIST ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

// ✅ DELETE WAITLIST ENTRY
export const deleteWaitlistEntry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Waitlist entry ID is required",
      });
    }

    const deletedEntry = await Waitlist.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message: "Waitlist entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Waitlist entry deleted successfully",
      data: deletedEntry,
    });
  } catch (err) {
    console.error("DELETE WAITLIST ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};