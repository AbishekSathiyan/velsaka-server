// src/config/db.js

import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI missing");
    process.exit(1);
  }

  try {
    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB ERROR:", err.message);

    setTimeout(connectDB, 5000); // 🔁 retry instead of exit
  }
};

/**
 * ✅ Connection events
 */
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose connected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected... retrying");
});

/**
 * ✅ Graceful shutdown
 */
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 MongoDB closed");
  process.exit(0);
});

export default connectDB;