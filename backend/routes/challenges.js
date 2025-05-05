const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User'); // Assuming User model is needed here for test-enroll or other routes

// --- Highly Specific Routes First ---

// Test route (can be early)
router.get('/test', (req, res) => {
  res.json({ message: "Routes are working!" });
});

// Add this temporary test route
router.post('/test-enroll', async (req, res) => {
  try {
    const { userId, challengeId, progressGoal } = req.body;
    console.log('Received enrollment request:', {
      userId,
      challengeId,
      progressGoal
    });

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json({ message: 'Test successful', user, challenge });
  } catch (error) {
    console.error('Test enrollment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Debug routes (more specific patterns)
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

router.get('/debug/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json({
      _id: challenge._id,
      id: challenge.id,
      title: challenge.title,
      participants: challenge.participants
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get featured challenges (specific static path)
router.get('/featured', async (req, res) => {
  try {
    const challenges = await Challenge.find({ isFeatured: true });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's active challenges (specific pattern with param)
router.get('/user/:userId/active', async (req, res) => {
  try {
    const challenges = await Challenge.find({
      'participants.user': req.params.userId,
      'participants.status': 'active'
    });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// --- General Routes (no params or starting with param) ---

// Get all challenges with filters (no parameters, but can match root)
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

// Create a new challenge (no parameters, for the base path)
router.post('/', async (req, res) => {
  try {
    const challenge = new Challenge({
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

// Enroll in a challenge (static path relative to base)
router.post('/enroll', async (req, res) => {
  try {
    const { userId, challengeId, progressGoal } = req.body;

    if (!userId || !challengeId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Check if already enrolled
    if (challenge.participants.some(p => p.user.toString() === userId)) {
      return res.status(400).json({ message: 'Already enrolled in this challenge' });
    }

    // Add participant
    challenge.participants.push({
      user: userId,
      progressGoal: progressGoal || 100,
      progress: 0,
      status: 'active',
      streak: 0
    });

    const updatedChallenge = await challenge.save();
    res.status(201).json(updatedChallenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// --- Routes with Generic Parameters (/:id based) ---
// Place these after more specific routes

// Get participant stats (parameter at start)
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

// Update challenge progress (parameter at start)
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


// Get challenge by ID (Most generic GET by ID - last GET with :id)
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    // If the ID format is invalid (e.g., not an ObjectId), Mongoose will throw
    // a CastError, which you might want to handle specifically.
    if (error.name === 'CastError') {
         return res.status(400).json({ message: 'Invalid Challenge ID' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Update challenge (Most generic PUT by ID)
router.put('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'participants') { // Prevent updating these fields directly
        challenge[key] = req.body[key];
      }
    });

    const updatedChallenge = await challenge.save();
    res.json(updatedChallenge);
  } catch (error) {
     if (error.name === 'CastError') {
         return res.status(400).json({ message: 'Invalid Challenge ID' });
     }
    res.status(400).json({ message: error.message });
  }
});

// Delete challenge (Most generic DELETE by ID)
router.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    // Use deleteOne() with a query to ensure the correct document is deleted
    // Or if challenge is the Mongoose document: await challenge.deleteOne();
     await Challenge.deleteOne({ _id: req.params.id }); // Safer way

    res.json({ message: 'Challenge deleted' });
  } catch (error) {
     if (error.name === 'CastError') {
         return res.status(400).json({ message: 'Invalid Challenge ID' });
     }
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
