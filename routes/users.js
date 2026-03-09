const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Get all employees (admin only)
router.get("/employees", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" });
    res.json({ employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete employee (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cleanup related data (leaves, schedules, salaries)
    const Leave = require("../models/Leave");
    const Salary = require("../models/Salary");
    const Schedule = require("../models/Schedule");

    await Leave.deleteMany({ userId: user._id });
    await Salary.deleteMany({ userId: user._id });
    await Schedule.deleteMany({ userId: user._id });

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
