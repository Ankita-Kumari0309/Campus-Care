import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role }, // 🔹 Must match authMiddleware
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, role: user.role, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = req.user; // authMiddleware attaches user to req
    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Update current user profile
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const user = req.user; // user from authMiddleware
    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // remember to hash if using pre-save hooks

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
