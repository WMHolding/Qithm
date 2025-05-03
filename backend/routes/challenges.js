const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: "Routes are working!" });
});

// Add this temporary test route at the top of your routes
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

// CREATE - Create a new challenge
router.post('/create', async (req, res) => {
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

// Get all challenges
router.get('/all', async (req, res) => {
  try {
    const challenges = await Challenge.find({});
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured challenges
router.get('/featured', async (req, res) => {
  try {
    const challenges = await Challenge.find({ isFeatured: true });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's active challenges
router.get('/user/:userId/active', async (req, res) => {
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
    console.log('Enrollment request received:', req.body);
    const { userId, challengeId, progressGoal } = req.body;
    
    // Use findById instead of creating a new challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      console.log('Challenge not found:', challengeId);
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Check if already enrolled
    const isEnrolled = challenge.participants.some(
      p => p.user.toString() === userId
    );
    
    if (isEnrolled) {
      return res.status(400).json({ 
        message: 'Already enrolled in this challenge'
      });
    }

    // Add the new participant
    challenge.participants.push({
      user: userId,
      progressGoal: progressGoal || 100,
      progress: 0,
      status: 'active',
      streak: 0
    });

    // Save the updated challenge
    const updatedChallenge = await challenge.save();
    console.log('Enrollment successful:', {
      challengeId: updatedChallenge._id,
      userId,
      participantsCount: updatedChallenge.participants.length
    });

    res.status(201).json(updatedChallenge);
  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Get challenge by ID (must be last)
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

// Add this temporary debug route
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

module.exports = router; 