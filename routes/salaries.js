const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const Salary = require("../models/Salary");
const User = require("../models/User");

const router = express.Router();

// Set salary (admin only)
router.post("/set", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ message: "Email and amount are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let salary = await Salary.findOne({ userId: user._id });

    if (salary) {
      salary.amount = amount;
      salary.updatedBy = req.userId;
      salary.updatedAt = new Date();
      await salary.save();
    } else {
      salary = new Salary({
        email: email.toLowerCase(),
        userId: user._id,
        amount,
        updatedBy: req.userId,
      });
      await salary.save();
    }

    res.json({ message: "Salary updated", salary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get salary for current user
router.get("/my-salary", authMiddleware, async (req, res) => {
  try {
    const salary = await Salary.findOne({ email: req.userEmail });
    res.json({ salary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all salaries (admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.json({ salaries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
