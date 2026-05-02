import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ success: false });

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({});
    next();
  } catch {
    res.status(401).json({});
  }
};