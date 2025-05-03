const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');

// IMPORTANT: More specific routes must come BEFORE the /:id route
router.get('/test', (req, res) => {
  res.json({ message: "Routes are working!" });
});

// CREATE - Create a new challenge
router.post('/', async (req, res) => {
  try {
    const challenge = new Challenge({
      id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
      category: req.body.category,
      difficulty: req.body.difficulty,
      image: req.body.image,
      requirements: req.body.requirements,
      isFeatured: req.body.isFeatured,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });
    const newChallenge = await challenge.save();
    res.status(201).json(newChallenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all featured challenges
router.get('/featured', async (req, res) => {
  try {
    const challenges = await Challenge.find({ isFeatured: true });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ - Get all challenges (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, featured } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (featured === 'true') query.isFeatured = true;
    
    const challenges = await Challenge.find(query);
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - Get challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE - Update a challenge
router.put('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (key !== '_id') { // Prevent _id modification
        challenge[key] = req.body[key];
      }
    });

    const updatedChallenge = await challenge.save();
    res.json(updatedChallenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Delete a challenge
router.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    await challenge.deleteOne();
    res.json({ message: 'Challenge deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PARTICIPANT MANAGEMENT
// Update participant progress
router.patch('/:id/progress', async (req, res) => {
  try {
    const { userId, progress } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const participant = challenge.participants.find(p => p.user.toString() === userId);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    participant.progress = progress;
    if (progress >= participant.progressGoal) {
      participant.status = 'completed';
    }

    await challenge.save();
    res.json(challenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get participant stats
router.get('/:id/stats/:userId', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const participant = challenge.participants.find(p => p.user.toString() === req.params.userId);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    res.json({
      progress: participant.progress,
      progressGoal: participant.progressGoal,
      status: participant.status,
      streak: participant.streak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find({});
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Add this temporarily to see available challenges
router.get('/all', async (req, res) => {
  try {
    const challenges = await Challenge.find({});
    res.json(challenges.map(c => ({
      _id: c._id,
      title: c.title
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this debug route
router.get('/debug', async (req, res) => {
  try {
    const challenges = await Challenge.find({});
    res.json({
      count: challenges.length,
      challenges: challenges
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      location: 'debug route'
    });
  }
});

// This must come LAST because it catches all other paths
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 