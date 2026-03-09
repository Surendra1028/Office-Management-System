const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Update current user's email/password (authenticated)
router.patch("/update", authMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If changing email, ensure uniqueness
    if (email && email.toLowerCase() !== user.email) {
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists)
        return res.status(400).json({ message: "Email already in use" });
      user.email = email.toLowerCase();
    }

    if (password) {
      user.password = password; // will be hashed by pre-save hook
    }

    user.updatedAt = new Date();
    await user.save();

    // Issue a new token with updated email
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    );

    res.json({ message: "Account updated", user: user.toJSON(), token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
