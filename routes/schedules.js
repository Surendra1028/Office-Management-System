const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const Schedule = require("../models/Schedule");
const User = require("../models/User");

const router = express.Router();

// Create schedule (admin only)
router.post("/create", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { email, date, task } = req.body;

    if (!email || !date || !task) {
      return res
        .status(400)
        .json({ message: "Email, date, and task are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const schedule = new Schedule({
      email: email.toLowerCase(),
      userId: user._id,
      date: new Date(date),
      task,
      assignedBy: req.userId,
    });

    await schedule.save();

    res.status(201).json({
      message: "Schedule created",
      schedule,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get schedules for current user
router.get("/my-schedules", authMiddleware, async (req, res) => {
  try {
    const schedules = await Schedule.find({ email: req.userEmail });
    res.json({ schedules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all schedules (admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json({ schedules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
