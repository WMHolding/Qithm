// backend/socket.js
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken'); // For authenticating users via token
const PrivateChat = require('./models/PrivateChat'); // Your chat model
const User = require('./models/User'); // Your user model

let io; // Declare io outside the function to be accessible globally

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { // Configure CORS for Socket.IO as well
      origin: process.env.NODE_ENV === 'production'
         ? process.env.FRONTEND_URL
         : ['http://localhost:5173', 'http://localhost:3001'],
      methods: ["GET", "POST"]
    }
  });

  // --- Socket.IO Middleware for Authentication ---
  // This middleware runs before the 'connection' event
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token; // Get token from handshake headers
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password'); // Find user by ID

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user; // Attach the user object to the socket
      next(); // Authentication successful
    } catch (err) {
      console.error('Socket authentication failed:', err.message);
      return next(new Error('Authentication error: Invalid token'));
    }
  });


  // --- Socket.IO Connection Handling ---
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.user._id})`);

    // Event for joining a chat room
    socket.on('joinChat', (chatId) => {
      console.log(`${socket.user.username} joining chat: ${chatId}`);
      // Leave any previous rooms the user might be in (important for single chat view)
      socket.rooms.forEach(room => {
          if (room !== socket.id) { // Don't leave the default room assigned to the socket
              socket.leave(room);
              console.log(`${socket.user.username} left room: ${room}`);
          }
      });
      socket.join(chatId); // Join the specified chat room
    });

    // Event for leaving a chat room
    socket.on('leaveChat', (chatId) => {
        console.log(`${socket.user.username} leaving chat: ${chatId}`);
        socket.leave(chatId);
    });


    // Event for receiving a new message from a client
    socket.on('sendMessage', async ({ chatId, message }) => {
      if (!chatId || !message) {
        console.warn('Received sendMessage with missing chatId or message');
        return;
      }

      console.log(`Message from ${socket.user.username} in chat ${chatId}: "${message}"`);

      try {
        // Find the chat in the database
        const chat = await PrivateChat.findById(chatId);
        if (!chat) {
          console.error(`Chat not found for ID: ${chatId}`);
          // Optional: Emit an error back to the sender
          socket.emit('sendMessageError', { chatId, error: 'Chat not found' });
          return;
        }

        // Add the new message to the chat
        const newMessage = {
          sender: socket.user._id, // Use the user ID from authenticated socket
          message: message,
          timestamp: new Date()
        };
        chat.messages.push(newMessage);

        // Save the updated chat to the database
        await chat.save();

        // Populate the sender field for the message object we'll broadcast
        // We find the message in the saved chat by comparing content and time (simplistic)
        // A more robust way is to get the message directly from the save result if possible,
        // or add a unique temp ID before saving and find by that.
         const savedMessage = chat.messages.find(msg => msg.message === message && msg.sender.toString() === socket.user._id.toString());
         const populatedMessage = await PrivateChat.populate(savedMessage, {
            path: 'sender',
            select: 'username profilePicture' // Select fields to send to frontend
         });


        // Broadcast the new message to all clients in the chat room (including the sender)
        io.to(chatId).emit('newMessage', { chatId, message: populatedMessage });

      } catch (error) {
        console.error('Error saving or broadcasting message:', error);
        // Optional: Emit an error back to the sender
         socket.emit('sendMessageError', { chatId, error: 'Failed to send message' });
      }
    });

    // Event when a user disconnects
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username} (${socket.user._id})`);
      // Socket.IO automatically handles leaving rooms on disconnect
    });
  });

  console.log('Socket.IO initialized.');

  // Optional: Export io if you need to use it elsewhere (e.g., from a route)
  // module.exports = io;
};

module.exports = initializeSocket;
