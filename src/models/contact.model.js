import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
    default: "",
  },
  service: {
    type: String,
    enum: [
      "Web Development",
      "App Development",
      "AI Chatbot",
      "ATS System",
      "UI/UX Design",
      "Cloud Solutions",
      "DevOps Services",
      "Job Enquiry",
    ],
    default: "Web Development",
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "read", "replied", "archived"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// auto update timestamp
contactSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;