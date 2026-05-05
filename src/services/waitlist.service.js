// src/services/waitlist.service.js

import Waitlist from "../models/waitlist.model.js";

/**
 * ✅ Create or return existing email (atomic)
 */
export const createEmail = async (email) => {
  try {
    if (!email) throw new Error("Email is required");

    const normalizedEmail = email.toLowerCase().trim();

    const user = await Waitlist.create({ email: normalizedEmail });

    return {
      user,
      isNew: true,
    };
  } catch (err) {
    // ✅ Handle duplicate
    if (err.code === 11000) {
      const existingUser = await Waitlist.findOne({
        email: email.toLowerCase().trim(),
      });

      return {
        user: existingUser,
        isNew: false,
      };
    }

    console.error("createEmail ERROR:", err.message);
    throw err;
  }
};

/**
 * ✅ Get all waitlist emails
 */
export const getAllEmails = async () => {
  try {
    const users = await Waitlist.find().sort({ createdAt: -1 });
    return users;
  } catch (err) {
    console.error("getAllEmails ERROR:", err.message);
    throw err;
  }
};