import dotenv from "dotenv";
dotenv.config();

import app from "./App.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

// Connect DB FIRST
connectDB();

// Start server ONLY ONCE
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`);
  console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
});