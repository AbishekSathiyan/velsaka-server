// src/config/env.js
import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "velsaka_tech_super_secret_key_2024_secure",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

// Log to verify (remove in production)
console.log("Environment loaded:");
console.log("JWT_SECRET exists:", !!ENV.JWT_SECRET);
console.log("ADMIN_EMAIL:", ENV.ADMIN_EMAIL);