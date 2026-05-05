// index.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./src/config/db.js";

// ✅ Routes
import adminAuthRoutes from "./src/routes/adminAuth.routes.js";
import waitlistRoutes from "./src/routes/waitlist.routes.js";

// ✅ Fix Render IPv6 issue (must be before network ops)
dns.setDefaultResultOrder("ipv4first");

// ✅ Load env
dotenv.config();

// ✅ ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * ✅ CONNECT DB (fail-fast)
 */
try {
  await connectDB();
  console.log("✅ MongoDB connected");
} catch (err) {
  console.error("❌ DB connection failed:", err.message);
  process.exit(1);
}

/**
 * ✅ MIDDLEWARE
 */
app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://velsaka-tech-ayq8pd2md-abisheksathiyans-projects.vercel.app/", // 🔥 replace this
    ],
    credentials: true,
  })
);

app.use(express.json());

/**
 * ✅ REQUEST LOGGER (dev only)
 */
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.url}`);
    next();
  });
}

/**
 * ✅ ENV DEBUG
 */
console.log("\n📋 Environment check:");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅" : "❌");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅" : "❌");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅" : "❌");

/**
 * ✅ ROUTES (REGISTER BEFORE SERVER START)
 */
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/waitlist", waitlistRoutes);

// Optional dynamic routes
try {
  const contactRoutes = await import("./src/routes/contact.routes.js");
  app.use("/api/contact", contactRoutes.default);
  console.log("✅ Contact routes loaded");
} catch {
  console.log("⚠️ Contact routes not found");
}

/**
 * ✅ HEALTH CHECK
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * ✅ ROOT
 */
app.get("/", (req, res) => {
  res.json({
    message: "VELSAKA TECH API Server",
    status: "running",
  });
});

/**
 * ✅ GLOBAL ERROR HANDLER (IMPORTANT)
 */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/**
 * ✅ START SERVER (LAST STEP)
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
});

/**
 * ✅ GRACEFUL SHUTDOWN
 */
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");
  process.exit(0);
});