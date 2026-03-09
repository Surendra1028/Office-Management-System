const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const Leave = require("../models/Leave");
const User = require("../models/User");

const router = express.Router();

// Apply leave (employee)
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { date, reason } = req.body;

    if (!date || !reason) {
      return res.status(400).json({ message: "Date and reason are required" });
    }

    const user = await User.findById(req.userId);
    const leave = new Leave({
      email: req.userEmail,
      userId: req.userId,
      date: new Date(date),
      reason,
      status: "Pending",
    });

    await leave.save();

    res.status(201).json({
      message: "Leave request submitted",
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaves for current user
router.get("/my-leaves", authMiddleware, async (req, res) => {
  try {
    const leaves = await Leave.find({ email: req.userEmail });
    res.json({ leaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all leaves (admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json({ leaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update leave status (admin only)
router.patch("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true },
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json({ message: "Leave status updated", leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
