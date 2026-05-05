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

// ✅ Fix IPv6 issue (Render)
dns.setDefaultResultOrder("ipv4first");

// ✅ Load env FIRST
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//
// 🔥 1. BUILD ALLOWED ORIGINS FROM ENV (BEFORE CORS)
//
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [
      process.env.CLIENT_URL,
      process.env.PROD_CLIENT_URL,
    ].filter(Boolean);

console.log("🌐 Allowed Origins:", allowedOrigins);

//
// 🔥 2. CONNECT DB (FAIL FAST)
//
try {
  await connectDB();
  console.log("✅ MongoDB connected");
} catch (err) {
  console.error("❌ DB connection failed:", err.message);
  process.exit(1);
}

//
// 🔥 3. SECURITY MIDDLEWARE
//
app.use(helmet());

//
// 🔥 4. CORS (SINGLE SOURCE OF TRUTH)
//
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      // ✅ Allow all Vercel preview deployments
      if (origin.includes("vercel.app")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

//
// 🔥 5. BODY PARSER
//
app.use(express.json());

//
// 🔥 6. REQUEST LOGGER (DEV ONLY)
//
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.url}`);
    next();
  });
}

//
// 🔥 7. ENV DEBUG
//
console.log("\n📋 Environment check:");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅" : "❌");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅" : "❌");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅" : "❌");

//
// 🔥 8. ROUTES
//
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/waitlist", waitlistRoutes);

// ✅ Dynamic import (safe)
try {
  const contactRoutes = await import("./src/routes/contact.routes.js");
  app.use("/api/contact", contactRoutes.default);
  console.log("✅ Contact routes loaded");
} catch (err) {
  console.log("⚠️ Contact routes not found");
}

//
// 🔥 9. HEALTH CHECK
//
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

//
// 🔥 10. ROOT
//
app.get("/", (req, res) => {
  res.json({
    message: "VELSAKA TECH API Server",
    status: "running",
  });
});

//
// 🔥 11. GLOBAL ERROR HANDLER
//
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

//
// 🔥 12. START SERVER (LAST)
//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

//
// 🔥 13. GRACEFUL SHUTDOWN
//
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");
  process.exit(0);
});