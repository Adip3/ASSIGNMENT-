const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { protect } = require("../middlewares/auth");

// Get all posts (feed)
router.get("/", protect, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name headline profilePicture")
      .populate("likes", "name")
      .populate("comments.user", "name profilePicture")
      .sort("-createdAt")
      .limit(20);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a post
router.post("/", protect, async (req, res) => {
  try {
    const post = await Post.create({
      author: req.user._id,
      content: req.body.content,
      image: req.body.image,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name headline profilePicture"
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single post
router.get("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name headline profilePicture")
      .populate("likes", "name")
      .populate("comments.user", "name profilePicture");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike a post
router.put("/:id/like", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userIndex = post.likes.indexOf(req.user._id);

    if (userIndex > -1) {
      // Unlike
      post.likes.splice(userIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name headline profilePicture")
      .populate("likes", "name");

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Comment on a post
router.post("/:id/comment", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user._id,
      text: req.body.text,
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name headline profilePicture")
      .populate("comments.user", "name profilePicture");

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a post
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await post.remove();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
