import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./src/config/db.js";

// Routes
import adminAuthRoutes from "./src/routes/adminAuth.routes.js";
import waitlistRoutes from "./src/routes/waitlist.routes.js";

// ========================
// 1. ENV FIRST
// ========================
dotenv.config();

// ========================
// 2. FIX IPv6 ISSUE (IMPORTANT)
// ========================
dns.setDefaultResultOrder("ipv4first");

// ========================
// 3. PATH SETUP
// ========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================
// 4. APP INIT
// ========================
const app = express();

// ========================
// 5. ALLOWED ORIGINS
// ========================
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [process.env.CLIENT_URL, process.env.PROD_CLIENT_URL].filter(Boolean);

console.log("🌐 Allowed Origins:", allowedOrigins);

// ========================
// 6. DB CONNECTION
// ========================
try {
  await connectDB();
  console.log("✅ MongoDB connected");
} catch (err) {
  console.error("❌ DB connection failed:", err.message);
  process.exit(1);
}

// ========================
// 7. SECURITY
// ========================
app.use(helmet());

// ========================
// 8. CORS
// ========================
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

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

// ========================
// 9. BODY PARSER
// ========================
app.use(express.json());

// ========================
// 10. LOGGER
// ========================
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.url}`);
    next();
  });
}

// ========================
// 11. ENV CHECK
// ========================
console.log("\n📋 Environment check:");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅" : "❌");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅" : "❌");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅" : "❌");

// ========================
// 12. ROUTES
// ========================
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/waitlist", waitlistRoutes);

// Contact routes (safe dynamic import)
try {
  const contactRoutes = await import("./src/routes/contact.routes.js");
  app.use("/api/contact", contactRoutes.default);
  console.log("✅ Contact routes loaded");
} catch (err) {
  console.log("⚠️ Contact routes not found");
}

// ========================
// 13. HEALTH CHECK
// ========================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ========================
// 14. ROOT
// ========================
app.get("/", (req, res) => {
  res.json({
    message: "VELSAKA TECH API Server",
    status: "running",
  });
});

// ========================
// 15. ERROR HANDLER
// ========================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ========================
// 16. START SERVER
// ========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ========================
// 17. GRACEFUL SHUTDOWN
// ========================
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");
  process.exit(0);
});