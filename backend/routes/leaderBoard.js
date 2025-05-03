const express = require("express");
const router = express.Router();
const User = require("../models/User"); 


router.get("/", async (req, res) => {
  const type = req.query.type;

  let sortField;
  if (type === "walking") {
    sortField = "steps";
  } else if (type === "resistance") {
    sortField = "resistanceHours";
  } else {
    return res.status(400).json({ error: "Invalid leaderboard type" });
  }

  try {
    const topUsers = await User.find()
      .sort({ [sortField]: -1 })
      .limit(10)
      .select("username avatar steps resistanceHours streak");

    res.json(topUsers);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Server error while fetching leaderboard" });
  }
});

module.exports = router;
