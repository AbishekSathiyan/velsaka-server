// src/middlewares/auth.middleware.js

import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, ENV.JWT_SECRET);

      req.user = decoded; // full payload

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: "No token provided",
  });
};

// 🔥 Role-based middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    next();
  };
};