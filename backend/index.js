// backend/index.js

require('dotenv').config(); // Load environment variables
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Import http module
const { connectDB } = require('./config/db');
const initializeSocket = require('./socket'); // Import the socket initializer

// Import routes
const challengeRoutes = require('./routes/challenges');
const testRoutes = require('./routes/test');
const championshipRoutes = require('./routes/championships');
const chatRoutes = require('./routes/chats'); // Keep this for fetching chat list and history
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profile');
const leaderboardRoutes = require('./routes/leaderBoard');

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO (attach to the HTTP server)
initializeSocket(server);

// Connect to database
connectDB();

// --- Middleware ---
 
// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production'
         ? process.env.FRONTEND_URL
         : ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:5174']; // Add more as needed

// --- Add this log before applying CORS middleware ---
console.log('CORS Allowed Origins:', allowedOrigins);
// -----------------------------------------------------

app.use(cors({
  origin: allowedOrigins, // Use the variable
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
// API routes
app.use('/api/challenges', challengeRoutes);
app.use('/api/test', testRoutes);
app.use('/api/championships', championshipRoutes);
app.use('/api/chats', chatRoutes); // Keep this for fetching chat list and history
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    status: 'Healthy',
    timestamp: new Date().toISOString(),
    databaseState: dbState === 1 ? 'Connected' : `State ${dbState}`
  });
});

// --- Error Handling ---
// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      message: "API endpoint not found",
      path: req.originalUrl
    });
  }
  next();
});

// Error handler
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// --- Server Startup ---
// Start server in local development mode
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  // Use the HTTP server (which Express is attached to) to listen
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for Vercel serverless function handling
// NOTE: Vercel automatically handles the server listening in production
module.exports = app;
