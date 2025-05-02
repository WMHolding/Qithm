const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');

// Get all featured challenges
router.get('/featured', async (req, res) => {
  try {
    const challenges = await Challenge.find({ isFeatured: true });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get user's active challenges
router.get('/active/:userId', async (req, res) => {
  try {
    const challenges = await Challenge.find({
      'participants.user': req.params.userId,
      'participants.status': 'active'
    });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enroll in a challenge
router.post('/enroll', async (req, res) => {
  try {
    const { userId, challengeId, progressGoal } = req.body;
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Check if already enrolled
    if (challenge.participants.some(p => p.user.toString() === userId)) {
      return res.status(400).json({ message: 'Already enrolled in this challenge' });
    }

    challenge.participants.push({
      user: userId,
      progressGoal
    });

    await challenge.save();
    res.status(201).json(challenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a challenge by ID
router.get('/:id', async (req, res) => {
    const one = await Challenge.findOne({ id: req.params.id });
    if (!one) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(one);
  });

module.exports = router; 