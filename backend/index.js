require('dotenv').config(); // Load environment variables
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Import http module
const path = require('path'); // <<< Import path

// If using ES Modules (import/export), use this instead of require('path')
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


const { connectDB } = require('./config/db');
const initializeSocket = require('./socket'); // Import the socket initializer

// Import routes
const challengeRoutes = require('./routes/challenges');
const testRoutes = require('./routes/test');
const championshipRoutes = require('./routes/championships');
const chatRoutes = require('./routes/chats'); // Keep this for fetching chat list and history
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('../routes/profile'); // << Note: Adjust path if needed based on your folder structure
const leaderboardRoutes = require('./routes/leaderBoard'); // << Note: Adjust path if needed

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
         ? process.env.FRONTEND_URL // This should be your Render frontend URL if it's a separate service,
         : ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:5174', 'https://*.render.com']; // Add Render domain patterns if backend and frontend are separate, or if testing Render locally

// If serving frontend from Express, allowedOrigins might just need your backend's Render URL or patterns
// If the frontend is served by this Express server, you might not need CORS for /api routes from the frontend
// originating from the same server. But keep it for external API calls if needed.
// For this setup (Express serving static), you generally won't need the frontend URL here,
// as the frontend requests will be same-origin relative to the Express server.
// The CORS middleware is primarily for allowing requests from *different* origins to your API routes.

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

// --- Static File Serving (Add this section) ---
// This needs to be BEFORE your API routes
// The path.join will point from backend/index.js up one level (..) to the repo root,
// then into the frontend directory, and then into the dist directory.
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist'); // <<< Adjust if your structure is different

// Serve static files from the frontend build directory
app.use(express.static(frontendBuildPath));

// --- Routes ---
// API routes
app.use('/api/challenges', challengeRoutes);
app.use('/api/test', testRoutes);
app.use('/api/championships', championshipRoutes);
app.use('/api/chats', chatRoutes); // Keep this for fetching chat list and history
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/leaderboard', leaderboardRoutes);


// --- SPA Fallback Route (Add this section) ---
// For any requests that don't match the static files or API routes,
// serve the frontend's index.html. This is essential for client-side routing.
app.get('*', (req, res) => {
  // Check if the request path is an API route (Render health checks might hit '/')
  if (req.path.startsWith('/api/')) {
     // Already handled by the 404 middleware
     return;
  }
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});


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
// 404 handler for API routes (This can potentially be simplified now with the '*' route above)
// Let's keep it explicit for API paths.
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    // If it starts with /api but wasn't caught by an API route handler
    return res.status(404).json({
      message: "API endpoint not found",
      path: req.originalUrl
    });
  }
  // If it's not an /api path, let the '*' route handle it or proceed
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
// NOTE: Render handles the server listening in production via process.env.PORT
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  // Use the HTTP server (which Express is attached to) to listen
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for Vercel/serverless handling (optional for Render Web Service)
// Render's Web Service uses the server.listen call. This line doesn't hurt though.
// module.exports = app;
