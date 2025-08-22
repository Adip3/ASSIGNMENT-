const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship", "remote"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [
    {
      type: String,
    },
  ],
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: "USD",
    },
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  applicants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
      resume: String,
      coverLetter: String,
      status: {
        type: String,
        enum: ["pending", "reviewed", "shortlisted", "rejected"],
        default: "pending",
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: Date,
});

module.exports = mongoose.model("Job", jobSchema);
