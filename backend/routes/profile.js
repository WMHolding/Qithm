const express = require("express");
const router = express.Router();
const User = require("../schema/User");

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update profile" });
  }
});

module.exports = router;
