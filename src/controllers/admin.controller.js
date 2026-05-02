import {
  getAllEmails,
  deleteEmail,
  deleteAllEmails,
} from "../services/waitlist.service.js";

export const getWaitlistUsers = async (req, res) => {
  const users = await getAllEmails();
  res.json({ success: true, data: users });
};

export const deleteWaitlistUser = async (req, res) => {
  await deleteEmail(req.params.id);
  res.json({ success: true });
};

export const clearWaitlist = async (req, res) => {
  await deleteAllEmails();
  res.json({ success: true });
};