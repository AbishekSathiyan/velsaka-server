// src/models/waitlist.model.js

import mongoose from "mongoose";

const waitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // prevents duplicates
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const Waitlist = mongoose.model("Waitlist", waitlistSchema);

export default Waitlist;
