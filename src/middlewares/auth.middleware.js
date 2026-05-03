// src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const protectAdmin = async (req, res, next) => {
  let token;

  console.log("Auth middleware - Checking token...");

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      console.log("Token found:", token.substring(0, 50) + "...");
      
      // Verify token
      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      console.log("Token verified successfully for:", decoded.email);
      
      // Add admin info to request
      req.admin = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || "admin",
      };
      
      next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
        error: error.message,
      });
    }
  }

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};