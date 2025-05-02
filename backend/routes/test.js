const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Test route to create a user
router.post('/create-user', async (req, res) => {
  try {
    const user = new User({
      username: "testuser1",
      email: "test@test.com",
      password: "password123" // In production, this should be hashed
    });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Test route to create a challenge
router.post('/create-challenge', async (req, res) => {
  try {
    const challenge = new Challenge({
      title: "30-Day Running Challenge",
      description: "Join our 30-day running challenge to improve your cardiovascular health and endurance.",
      shortDescription: "Build your running stamina with daily goals",
      category: "cardio",
      difficulty: "medium",
      image: "running-image-url",
      requirements: [
        "Complete daily running goals",
        "Track your progress using a fitness app",
        "Share your achievements with the community"
      ],
      isFeatured: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
    const newChallenge = await challenge.save();
    res.status(201).json(newChallenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Test route to enroll a user in a challenge
router.post('/enroll-test', async (req, res) => {
  try {
    const { userId, challengeId } = req.body;
    
    // Find the challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Add user to challenge participants
    challenge.participants.push({
      user: userId,
      progressGoal: 100,
      progress: 0
    });
    await challenge.save();

    // Add challenge to user's enrolled challenges
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.enrolledChallenges.push(challengeId);
    await user.save();

    res.status(200).json({ message: 'Test enrollment successful' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all challenges
router.get('/challenges', async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 