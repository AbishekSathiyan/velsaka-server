import Waitlist from "../../src/models/waitlist.model.js";

// ➕ Create email entry
export const createEmail = async (email) => {
  const exists = await Waitlist.findOne({ email });

  if (exists) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  return await Waitlist.create({ email });
};

// 📥 Fetch all emails
export const fetchAllEmails = async () => {
  return await Waitlist.find().sort({ createdAt: -1 });
};
