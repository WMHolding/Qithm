const socketIO = require('socket.io');
const PrivateChat = require('./models/PrivateChat');

function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173", // Your frontend URL
      methods: ["GET", "POST"]
    }
  });

  // Store online users
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins with their userId
    socket.on('join', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('userOnline', userId);
    });

    // Handle private messages
    socket.on('privateMessage', async ({ chatId, message, senderId }) => {
      try {
        // Save message to database
        const chat = await PrivateChat.findById(chatId);
        if (!chat) return;

        const newMessage = {
          sender: senderId,
          message,
          timestamp: new Date()
        };

        chat.messages.push(newMessage);
        await chat.save();

        // Send to all participants
        chat.participants.forEach((participantId) => {
          const socketId = onlineUsers.get(participantId.toString());
          if (socketId) {
            io.to(socketId).emit('newMessage', {
              chatId,
              message: newMessage
            });
          }
        });
      } catch (error) {
        console.error('Message error:', error);
      }
    });

    // Typing indicator
    socket.on('typing', ({ chatId, userId }) => {
      socket.broadcast.emit('userTyping', { chatId, userId });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      let userId;
      for (const [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          userId = key;
          break;
        }
      }
      if (userId) {
        onlineUsers.delete(userId);
        io.emit('userOffline', userId);
      }
    });
  });

  return io;
}

module.exports = initializeSocket; 