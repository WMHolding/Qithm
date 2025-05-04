const express = require('express');
const router = express.Router();
const PrivateChat = require('../models/PrivateChat');
const User = require('../models/User');

// Get all chats for a user (specific routes first)
router.get('/user/:userId', async (req, res) => {
  try {
    const chats = await PrivateChat.find({
      participants: req.params.userId
    })
    .populate('participants', 'username profilePicture role')
    .populate('messages.sender', 'username profilePicture');
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new chat
router.post('/', async (req, res) => {
  try {
    const { participantIds } = req.body;
    
    if (!participantIds || participantIds.length !== 2) {
      return res.status(400).json({ message: 'Exactly two participants required' });
    }

    const users = await User.find({ _id: { $in: participantIds } });
    if (users.length !== 2) {
      return res.status(404).json({ message: 'One or more users not found' });
    }

    const existingChat = await PrivateChat.findOne({
      participants: { $all: participantIds }
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    const newChat = new PrivateChat({
      participants: participantIds,
      messages: []
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get messages from a chat
router.get('/:chatId/messages', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const chat = await PrivateChat.findById(req.params.chatId)
      .populate('messages.sender', 'username profilePicture')
      .select('messages');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const recentMessages = chat.messages.slice(-limit);
    res.json(recentMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message
router.post('/:chatId/messages', async (req, res) => {
  try {
    const { senderId, message } = req.body;
    
    if (!senderId || !message) {
      return res.status(400).json({ message: 'Sender ID and message are required' });
    }

    const chat = await PrivateChat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.messages.push({
      sender: senderId,
      message,
      timestamp: new Date()
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get specific chat by ID (keep at end)
router.get('/:chatId', async (req, res) => {
  try {
    const chat = await PrivateChat.findById(req.params.chatId)
      .populate('participants', 'username profilePicture role')
      .populate('messages.sender', 'username profilePicture');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 