import express from "express";
import cors from "cors";
import helmet from "helmet";

import waitlistRoutes from "./src/routes/waitlist.routes.js";
import adminAuthRoutes from "./src/routes/adminAuth.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";

import { ENV } from "./src/config/env.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: ENV.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// ROUTES
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/auth/admin", adminAuthRoutes); // ✅ FIXED
app.use("/api/contact", contactRoutes);

// TEST ROUTE
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Server is running!" });
});

app.get("/", (req, res) => res.send("API Running"));

export default app;