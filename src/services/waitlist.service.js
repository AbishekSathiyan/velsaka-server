import Waitlist from "../models/waitlist.model.js";

// create email
export const createEmail = async (email) => {
  const exists = await Waitlist.findOne({ email });

  if (exists) return exists;

  return await Waitlist.create({ email });
};

// delete single email
export const deleteEmail = async (id) => {
  return await Waitlist.findByIdAndDelete(id);
};

// ✅ ADD THIS (fix for your error)
export const deleteAllEmails = async () => {
  return await Waitlist.deleteMany({});
};

// get all emails
export const getAllEmails = async () => {
  return await Waitlist.find().sort({ createdAt: -1 });
};