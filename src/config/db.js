// src/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    console.log("🔄 Connecting to MongoDB...");
    
    // Remove the options object - they are not needed in Mongoose 7+
    await mongoose.connect(uri);

    console.log("✅ MongoDB Connected");
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
    process.exit(1);
  }
};

export default connectDB;