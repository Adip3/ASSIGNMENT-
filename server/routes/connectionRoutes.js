const express = require("express");
const router = express.Router();
const Connection = require("../models/Connection");
const User = require("../models/User");
const { protect } = require("../middlewares/auth");

// Get user connections
router.get("/my-connections", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "connections",
      "name headline profilePicture company position"
    );

    res.json(user.connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending connection requests
router.get("/pending", protect, async (req, res) => {
  try {
    const connections = await Connection.find({
      recipient: req.user._id,
      status: "pending",
    }).populate("requester", "name headline profilePicture company position");

    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send connection request
router.post("/request", protect, async (req, res) => {
  try {
    const { recipientId, message } = req.body;

    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id },
      ],
    });

    if (existingConnection) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    // Check if already connected
    const user = await User.findById(req.user._id);
    if (user.connections.includes(recipientId)) {
      return res.status(400).json({ message: "Already connected" });
    }

    // Create connection request
    const connection = await Connection.create({
      requester: req.user._id,
      recipient: recipientId,
      message,
    });

    // Update users' pending connections
    await User.findByIdAndUpdate(req.user._id, {
      $push: { sentConnections: recipientId },
    });

    await User.findByIdAndUpdate(recipientId, {
      $push: { pendingConnections: req.user._id },
    });

    res.status(201).json(connection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept connection request
router.put("/accept/:id", protect, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (connection.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    connection.status = "accepted";
    connection.updatedAt = Date.now();
    await connection.save();

    // Update both users' connections
    await User.findByIdAndUpdate(connection.requester, {
      $push: { connections: connection.recipient },
      $pull: { sentConnections: connection.recipient },
    });

    await User.findByIdAndUpdate(connection.recipient, {
      $push: { connections: connection.requester },
      $pull: { pendingConnections: connection.requester },
    });

    res.json({ message: "Connection accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject connection request
router.put("/reject/:id", protect, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (connection.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    connection.status = "rejected";
    connection.updatedAt = Date.now();
    await connection.save();

    // Update users' pending connections
    await User.findByIdAndUpdate(connection.requester, {
      $pull: { sentConnections: connection.recipient },
    });

    await User.findByIdAndUpdate(connection.recipient, {
      $pull: { pendingConnections: connection.requester },
    });

    res.json({ message: "Connection rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove connection
router.delete("/remove/:userId", protect, async (req, res) => {
  try {
    // Remove from both users' connections
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { connections: req.params.userId },
    });

    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { connections: req.user._id },
    });

    // Delete connection record
    await Connection.findOneAndDelete({
      $or: [
        { requester: req.user._id, recipient: req.params.userId },
        { requester: req.params.userId, recipient: req.user._id },
      ],
    });

    res.json({ message: "Connection removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get suggested connections
router.get("/suggestions", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Get users who are not already connected or have pending requests
    const suggestions = await User.find({
      _id: {
        $nin: [
          ...user.connections,
          ...user.pendingConnections,
          ...user.sentConnections,
          req.user._id,
        ],
      },
    })
      .select("name headline profilePicture company position")
      .limit(10);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
