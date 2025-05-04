const express = require("express");
const router = express.Router();
const User = require("../models/User"); 

// Get global leaderboard
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select('username points')
      .sort({ points: -1 })
      .limit(100);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user rank
router.get("/rank/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;
    res.json({ rank, points: user.points });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
