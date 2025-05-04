const express = require('express');
const router = express.Router();
const Championship = require('../models/Championship');

// Get featured championships (specific routes first)
router.get('/featured', async (req, res) => {
  try {
    const championships = await Championship.find({ isFeatured: true })
      .populate('participants.user', 'username email');
    res.json(championships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's championships
router.get('/user/:userId', async (req, res) => {
  try {
    const championships = await Championship.find({
      'participants.user': req.params.userId
    }).populate('participants.user', 'username email');
    res.json(championships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all championships
router.get('/', async (req, res) => {
  try {
    const championships = await Championship.find()
      .populate('participants.user', 'username email');
    res.json(championships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new championship
router.post('/', async (req, res) => {
  try {
    const championship = new Championship(req.body);
    const newChampionship = await championship.save();
    res.status(201).json(newChampionship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Enroll in championship
router.post('/enroll', async (req, res) => {
  try {
    const { userId, championshipId } = req.body;
    
    if (!userId || !championshipId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const championship = await Championship.findById(championshipId);
    if (!championship) {
      return res.status(404).json({ message: 'Championship not found' });
    }

    if (championship.participants.some(p => p.user.toString() === userId)) {
      return res.status(400).json({ message: 'Already enrolled in this championship' });
    }

    championship.participants.push({
      user: userId,
      points: 0,
      status: 'active',
      completedChallenges: []
    });

    const updatedChampionship = await championship.save();
    res.status(201).json(updatedChampionship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Complete challenge in championship
router.post('/:id/complete-challenge', async (req, res) => {
  try {
    const { userId, challengeId, pointsEarned } = req.body;
    
    const championship = await Championship.findById(req.params.id);
    if (!championship) {
      return res.status(404).json({ message: 'Championship not found' });
    }

    const participant = championship.participants.find(
      p => p.user.toString() === userId
    );

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    participant.completedChallenges.push({
      challenge: challengeId,
      pointsEarned,
      completedAt: new Date()
    });

    participant.points += pointsEarned;

    championship.participants.sort((a, b) => b.points - a.points);
    championship.participants.forEach((p, index) => {
      p.rank = index + 1;
    });

    await championship.save();
    res.json(championship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get championship by ID (keep at the end)
router.get('/:id', async (req, res) => {
  try {
    const championship = await Championship.findById(req.params.id)
      .populate('participants.user', 'username email');
    if (!championship) {
      return res.status(404).json({ message: 'Championship not found' });
    }
    res.json(championship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update championship
router.put('/:id', async (req, res) => {
  try {
    const championship = await Championship.findById(req.params.id);
    if (!championship) {
      return res.status(404).json({ message: 'Championship not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'participants') {
        championship[key] = req.body[key];
      }
    });

    const updatedChampionship = await championship.save();
    res.json(updatedChampionship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete championship
router.delete('/:id', async (req, res) => {
  try {
    const championship = await Championship.findById(req.params.id);
    if (!championship) {
      return res.status(404).json({ message: 'Championship not found' });
    }
    await championship.deleteOne();
    res.json({ message: 'Championship deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 