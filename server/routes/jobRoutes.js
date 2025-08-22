const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const User = require("../models/User");
const { protect } = require("../middlewares/auth");
const roleCheck = require("../middlewares/roleCheck");

// Get all jobs
router.get("/", protect, async (req, res) => {
  try {
    const { type, location, search } = req.query;
    const filter = { isActive: true };

    if (type) filter.type = type;
    if (location) filter.location = new RegExp(location, "i");
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { company: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    const jobs = await Job.find(filter)
      .populate("postedBy", "name company")
      .sort("-createdAt");

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a job (job_poster and admin only)
router.post(
  "/",
  protect,
  roleCheck("job_poster", "admin"),
  async (req, res) => {
    try {
      const job = await Job.create({
        ...req.body,
        postedBy: req.user._id,
      });

      const populatedJob = await Job.findById(job._id).populate(
        "postedBy",
        "name company"
      );

      res.status(201).json(populatedJob);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get single job
router.get("/:id", protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "name company")
      .populate("applicants.user", "name email headline");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply for a job (job_seeker only)
router.post(
  "/:id/apply",
  protect,
  roleCheck("job_seeker"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Check if already applied
      const alreadyApplied = job.applicants.some(
        (applicant) => applicant.user.toString() === req.user._id.toString()
      );

      if (alreadyApplied) {
        return res
          .status(400)
          .json({ message: "Already applied for this job" });
      }

      // Add application
      job.applicants.push({
        user: req.user._id,
        resume: req.body.resume,
        coverLetter: req.body.coverLetter,
      });

      await job.save();

      // Update user's applied jobs
      await User.findByIdAndUpdate(req.user._id, {
        $push: { appliedJobs: { job: job._id } },
      });

      res.json({ message: "Application submitted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update application status (job_poster only)
router.put(
  "/:id/applicants/:applicantId",
  protect,
  roleCheck("job_poster", "admin"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (
        job.postedBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const applicant = job.applicants.id(req.params.applicantId);

      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }

      applicant.status = req.body.status;
      await job.save();

      res.json({ message: "Application status updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update job
router.put(
  "/:id",
  protect,
  roleCheck("job_poster", "admin"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (
        job.postedBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      Object.keys(req.body).forEach((key) => {
        job[key] = req.body[key];
      });

      await job.save();
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete job
router.delete(
  "/:id",
  protect,
  roleCheck("job_poster", "admin"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (
        job.postedBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      await job.remove();
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
