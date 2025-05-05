// backend/routes/chats.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Import mongoose
const PrivateChat = require('../models/PrivateChat');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware'); // Assuming you have auth middleware
// const io = require('../socket').getIO(); // Optional: if you need to access io here


// --- Get all chats for the authenticated user ---
// GET /api/chats/user/me
// Using '/me' is often better than '/user/:userId' when the user ID comes from the token
router.get('/user/me', auth, async (req, res) => {
  try {
    const currentUserId = req.user.userId; // Get user ID from auth middleware

    const chats = await PrivateChat.find({
      participants: currentUserId
    })
    // Populate participants and message senders with selected fields
    .populate('participants', '_id username profilePicture role')
    .populate('messages.sender', '_id username profilePicture'); // Populate sender in messages


    // Sort chats by the timestamp of the last message (most recent first)
    chats.sort((a, b) => {
        const lastMsgA = a.messages.length > 0 ? a.messages[a.messages.length - 1].timestamp : new Date(0);
        const lastMsgB = b.messages.length > 0 ? b.messages[b.messages.length - 1].timestamp : new Date(0);
        return lastMsgB.getTime() - lastMsgA.getTime(); // Sort descending by timestamp
    });


    res.json(chats);
  } catch (error) {
    console.error("Error fetching user chats:", error.message);
    res.status(500).json({ message: 'Server Error while fetching user chats' });
  }
});

// --- Create a new chat ---
// POST /api/chats
// Protected route
router.post('/', auth, async (req, res) => {
  try {
    const { participantId } = req.body; // Expecting only the other participant's ID
    const currentUserId = req.user.userId; // Get current user ID from auth middleware

    if (!participantId) {
      return res.status(400).json({ message: 'Other participant ID is required' });
    }

    // Ensure the other participant ID is a valid Mongoose ObjectId
     if (!mongoose.Types.ObjectId.isValid(participantId)) {
         return res.status(400).json({ message: 'Invalid participant ID format' });
     }

    // Ensure user is not trying to create a chat with themselves (unless allowed by design)
    if (currentUserId === participantId) {
        return res.status(400).json({ message: 'Cannot create chat with yourself' });
    }

    // Get the two participant IDs, ensuring they are distinct
    const participantIds = [currentUserId, participantId];
    const distinctParticipantIds = [...new Set(participantIds)];

    // Check if the other participant exists
    const otherUser = await User.findById(participantId);
     if (!otherUser) {
         return res.status(404).json({ message: 'Other participant not found' });
     }


    // Check if a chat between these two distinct participants already exists
    // Using $all ensures both IDs are present, $size: 2 ensures only these two
    const existingChat = await PrivateChat.findOne({
      participants: { $all: distinctParticipantIds, $size: 2 }
    });

    if (existingChat) {
       // If chat exists, return it (populated)
       const populatedChat = await PrivateChat.findById(existingChat._id)
            .populate('participants', '_id username profilePicture role')
            .populate('messages.sender', '_id username profilePicture'); // Populate messages too
      return res.status(200).json(populatedChat); // Use 200 OK for existing resource
    }

    // If no existing chat, create a new one
    const newChat = new PrivateChat({
      participants: distinctParticipantIds,
      messages: [] // Start with no messages
    });

    await newChat.save();

    // Populate the new chat before sending it back
    const populatedNewChat = await PrivateChat.findById(newChat._id)
         .populate('participants', '_id username profilePicture role')
         .populate('messages.sender', '_id username profilePicture'); // Populate messages too


    res.status(201).json(populatedNewChat); // Use 201 Created for a new resource

  } catch (error) {
    console.error("Error creating chat:", error.message);
    // Handle validation errors (e.g., invalid ObjectId format if not caught by check)
     if (error.name === 'ValidationError' || error.name === 'CastError') {
         return res.status(400).json({ message: error.message });
     }
    res.status(500).json({ message: 'Server Error while creating chat' });
  }
});


// --- Get messages from a chat (used for history) ---
// GET /api/chats/:chatId/messages
// Protected route - ensure the user is a participant in the chat
router.get('/:chatId/messages', auth, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const currentUserId = req.user.userId;

    // Validate chatId format
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ message: 'Invalid chat ID format' });
    }

    // Find the chat and ensure the current user is a participant
    const chat = await PrivateChat.findOne({
        _id: chatId,
        participants: currentUserId // Check if the authenticated user is in the participants list
    })
    // Populate sender info for each message
    .populate('messages.sender', '_id username profilePicture')
    .select('messages'); // Only select the messages field

    if (!chat) {
      // If chat not found or user is not a participant
      return res.status(404).json({ message: 'Chat not found or you are not a participant' });
    }

    const limit = parseInt(req.query.limit) || 50; // Default limit for messages

    // Get the last 'limit' messages
    // Use slice or skip/limit on query for performance with large message counts
    const recentMessages = chat.messages.slice(-limit);

    res.json(recentMessages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
     if (error.name === 'CastError') {
         return res.status(400).json({ message: "Invalid chat ID format" });
     }
    res.status(500).json({ message: 'Server Error while fetching messages' });
  }
});

// --- Sending messages is now handled by Socket.IO ---
// Remove the old POST /:chatId/messages route handler if it exists

// --- Get specific chat by ID (used when selecting a chat from sidebar or direct access) ---
// GET /api/chats/:chatId
// Protected route - ensure the user is a participant in the chat
router.get('/:chatId', auth, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const currentUserId = req.user.userId;

     // Validate chatId format
     if (!mongoose.Types.ObjectId.isValid(chatId)) {
         return res.status(400).json({ message: 'Invalid chat ID format' });
     }


    const chat = await PrivateChat.findOne({
        _id: chatId,
        participants: currentUserId // Ensure the authenticated user is a participant
    })
      .populate('participants', '_id username profilePicture role') // Populate participants
      .populate('messages.sender', '_id username profilePicture'); // Populate sender in messages

    if (!chat) {
      // If chat not found or user is not a participant
      return res.status(404).json({ message: 'Chat not found or you are not a participant' });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error fetching chat by ID:", error.message);
      if (error.name === 'CastError') {
         return res.status(400).json({ message: "Invalid chat ID format" });
     }
    res.status(500).json({ message: 'Server Error while fetching chat by ID' });
  }
});

// --- Optional: Delete a chat ---
// DELETE /api/chats/:chatId
// Protected route - Implement carefully, maybe only allow users to 'leave' a chat
/*
router.delete('/:chatId', auth, async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const currentUserId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
             return res.status(400).json({ message: 'Invalid chat ID format' });
        }

        // Find the chat and ensure the user is a participant before allowing deletion/leaving
        const chat = await PrivateChat.findOne({
             _id: chatId,
             participants: currentUserId
        });

        if (!chat) {
             return res.status(404).json({ message: 'Chat not found or you are not a participant' });
        }

        // Implement your logic for deletion:
        // Option 1: Remove the user from participants (user 'leaves' the chat)
        // chat.participants = chat.participants.filter(pId => pId.toString() !== currentUserId);
        // await chat.save();
        // res.json({ message: 'Left chat successfully' });

        // Option 2: Completely delete the chat (only if both agree or specific roles allowed)
        // await chat.deleteOne();
        // res.json({ message: 'Chat deleted successfully' });

        // For this example, we won't implement full deletion logic but provide the structure
         res.status(501).json({ message: 'Chat deletion not implemented' }); // Not Implemented


    } catch (error) {
        console.error("Error deleting chat:", error.message);
         if (error.name === 'CastError') {
             return res.status(400).json({ message: "Invalid chat ID format" });
         }
        res.status(500).json({ message: 'Server Error while deleting chat' });
    }
});
*/


module.exports = router;
