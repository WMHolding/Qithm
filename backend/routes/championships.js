const express = require('express');
const router = express.Router();
const Championship = require('../models/Championship');

// CREATE - Create a new championship
router.post('/', async (req, res) => {
  try {
    const championship = new Championship({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
      image: req.body.image,
      prizes: req.body.prizes,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });
    const newChampionship = await championship.save();
    res.status(201).json(newChampionship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ - Get all championships (with filters)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) query.status = status;
    
    const championships = await Championship.find(query)
      .populate('participants.user', 'username email'); // Populate user details
    res.json(championships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - Get championship by ID
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

// UPDATE - Update a championship
router.put('/:id', async (req, res) => {
  try {
    const championship = await Championship.findById(req.params.id);
    if (!championship) {
      return res.status(404).json({ message: 'Championship not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'participants') { // Prevent _id and participants modification
        championship[key] = req.body[key];
      }
    });

    const updatedChampionship = await championship.save();
    res.json(updatedChampionship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Delete a championship
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

// PARTICIPANT MANAGEMENT
// Join championship
router.post('/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;
    const championship = await Championship.findById(req.params.id);
    
    if (!championship) {
      return res.status(404).json({ message: 'Championship not found' });
    }

    // Check if already joined
    if (championship.participants.some(p => p.user.toString() === userId)) {
      return res.status(400).json({ message: 'Already joined this championship' });
    }

    championship.participants.push({
      user: userId,
      points: 0,
      status: 'active'
    });

    await championship.save();
    res.status(201).json(championship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update participant points
router.patch('/:id/points', async (req, res) => {
  try {
    const { userId, points } = req.body;
    const championship = await Championship.findById(req.params.id);
    
    if (!championship) {
      return res.status(404).json({ message: 'Championship not found' });
    }

    const participant = championship.participants.find(p => p.user.toString() === userId);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    participant.points = points;
    
    // Recalculate ranks based on points
    championship.participants.sort((a, b) => b.points - a.points);
    championship.participants.forEach((p, index) => {
      p.rank = index + 1;
    });

    await championship.save();
    res.json(championship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const championship = await Championship.findById(req.params.id)
      .populate('participants.user', 'username email');
    
    if (!championship) {
      return res.status(404).json({ message: 'Championship not found' });
    }

    const leaderboard = championship.participants
      .sort((a, b) => b.points - a.points)
      .map((p, index) => ({
        rank: index + 1,
        username: p.user.username,
        points: p.points,
        status: p.status
      }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 