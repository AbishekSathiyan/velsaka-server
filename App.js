import express from "express";
import cors from "cors";
import helmet from "helmet";

import waitlistRoutes from "./src/routes/waitlist.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

app.use("/api/waitlist", waitlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Server is running!" });
});

app.get("/", (req, res) => res.send("API Running"));

export default app;