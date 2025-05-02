// backend/routes/api.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ────────  POST /api/signup  ────────
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({ username, email, password });
    console.log("📝 About to save:", newUser);

    await newUser.save();

    console.log("✅ User saved!");
    res.status(201).json({ msg: "Account created" });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// ────────  POST /api/login  ────────
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (user.password !== password)
      return res.status(401).json({ msg: "Wrong password" });

    res.json({
      msg: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        role: user.role, // ← هذا هو اللي ناقص
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
