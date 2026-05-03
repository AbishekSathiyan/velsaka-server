// index.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";

// Load env early
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import adminAuthRoutes from "./src/routes/adminAuth.routes.js";

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// Test env variables
console.log("\n📋 Environment check:");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Missing");
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL ? "✅ Set" : "❌ Missing");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Missing");

// Routes
app.use("/api/admin/auth", adminAuthRoutes);

// Contact routes (if exists)
try {
  const contactRoutes = await import("./src/routes/contact.routes.js");
  app.use("/api/contact", contactRoutes.default);
  console.log("✅ Contact routes loaded");
} catch (error) {
  console.log("⚠️ Contact routes not found");
}

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "VELSAKA TECH API Server",
    status: "running",
    endpoints: {
      sendOTP: "POST /api/admin/auth/send-otp",
      verifyOTP: "POST /api/admin/auth/verify-otp",
      getProfile: "GET /api/admin/auth/me",
      contacts: "GET /api/contact",
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔐 Admin Auth: http://localhost:${PORT}/api/admin/auth`);
  console.log(`📧 Contacts API: http://localhost:${PORT}/api/contact\n`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  process.exit(0);
});
