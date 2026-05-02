// src/controllers/waitlist.controller.js

import { createEmail } from "../services/waitlist.service.js";
import { sendMail } from "../services/mail.service.js";
import { welcomeTemplate } from "../services/templates/welcome.template.js";

export const joinWaitlist = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    console.log("Incoming email:", email);

    // ✅ Save to DB
    const user = await createEmail(email);

    console.log("Saved user:", user);

    // ✅ Send mail (non-blocking)
    sendMail({
      to: email,
      subject: "Welcome to VelSAKA TECH",
      html: welcomeTemplate(email),
    }).catch(err => console.log("Mail error:", err.message));

    res.json({
      success: true,
      data: user,
    });

  } catch (err) {
    console.error("JOIN WAITLIST ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};