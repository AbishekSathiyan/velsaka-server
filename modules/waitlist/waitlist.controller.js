import { createEmail, fetchAllEmails } from "./waitlist.service.js";
import { sendWelcomeEmail } from "../../src/utils/sendMail.js";

// 🔁 Response helper
const sendResponse = (res, status, success, message, data = null) => {
  return res.status(status).json({
    success,
    message,
    data,
  });
};

// ➕ Add to waitlist
export const addToWaitlist = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, 400, false, "Email required");
    }

    // service layer handles duplicate + create
    const user = await createEmail(email);

    // email send (non-critical → should not break API if fails)
    try {
      await sendWelcomeEmail(email);
    } catch (mailErr) {
      console.log("Email failed:", mailErr.message);
    }

    return sendResponse(res, 201, true, "Added + Email sent", user);
  } catch (err) {
    return sendResponse(
      res,
      err.statusCode || 500,
      false,
      err.message || "Server error",
    );
  }
};

// 📥 Get waitlist
export const getWaitlist = async (req, res) => {
  try {
    const users = await fetchAllEmails();

    return sendResponse(res, 200, true, "Fetched successfully", {
      count: users.length,
      users,
    });
  } catch (err) {
    return sendResponse(res, 500, false, "Server error");
  }
};
