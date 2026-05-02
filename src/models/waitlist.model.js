import mongoose from "mongoose";

const waitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// optional: auto update timestamp
waitlistSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Waitlist = mongoose.model("Waitlist", waitlistSchema);

export default Waitlist;