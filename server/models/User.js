const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "job_poster", "job_seeker"],
    default: "job_seeker",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  headline: {
    type: String,
    default: "",
  },
  summary: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  company: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  skills: [
    {
      type: String,
    },
  ],
  experience: [
    {
      title: String,
      company: String,
      location: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String,
    },
  ],
  education: [
    {
      school: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  pendingConnections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentConnections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  appliedJobs: [
    {
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["pending", "reviewed", "shortlisted", "rejected"],
        default: "pending",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
