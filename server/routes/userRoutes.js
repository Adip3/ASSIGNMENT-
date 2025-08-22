const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middlewares/auth");
const roleCheck = require("../middlewares/roleCheck");

// Get all users (admin only)
router.get("/", protect, roleCheck("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("connections", "name headline profilePicture");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put("/:id", protect, async (req, res) => {
  try {
    if (
      req.user._id.toString() !== req.params.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    const allowedUpdates = [
      "name",
      "headline",
      "summary",
      "location",
      "company",
      "position",
      "skills",
      "experience",
      "education",
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user (admin only)
router.delete("/:id", protect, roleCheck("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
