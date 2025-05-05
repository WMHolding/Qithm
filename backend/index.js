// backend/index.js

console.log('--- index.js: Script start ---');
require('dotenv').config(); // Load environment variables

console.log('index.js: Environment variables loaded.');
console.log('index.js: NODE_ENV:', process.env.NODE_ENV);
console.log('index.js: FRONTEND_URL:', process.env.FRONTEND_URL);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Import http module
const path = require('path'); // <<< Import path
console.log('index.js: Core modules (express, mongoose, cors, http, path) required.');

// If using ES Modules (import/export), use this instead of require('path')
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


const { connectDB } = require('./config/db');
const initializeSocket = require('./socket'); // Import the socket initializer
console.log('index.js: Custom modules (connectDB, initializeSocket) required.');

// Import routes
console.log('index.js: Starting route module imports...');
const challengeRoutes = require('./routes/challenges');
console.log('index.js: Imported challengeRoutes.');
const testRoutes = require('./routes/test');
console.log('index.js: Imported testRoutes.');
const championshipRoutes = require('./routes/championships');
console.log('index.js: Imported championshipRoutes.');
const chatRoutes = require('./routes/chats'); // Keep this for fetching chat list and history
console.log('index.js: Imported chatRoutes.');
const authRoutes = require('./routes/authRoutes');
console.log('index.js: Imported authRoutes.');
const profileRoutes = require('./routes/profile');
console.log('index.js: Imported profileRoutes.');
const leaderboardRoutes = require('./routes/leaderBoard');
console.log('index.js: Imported leaderboardRoutes.');
console.log('index.js: Finished route module imports.');


// Initialize Express app
console.log('index.js: Initializing Express app...');
const app = express();
console.log('index.js: Express app initialized.');

// Create HTTP server
console.log('index.js: Creating HTTP server...');
const server = http.createServer(app);
console.log('index.js: HTTP server created.');

// Initialize Socket.IO (attach to the HTTP server)
console.log('index.js: Initializing Socket.IO...');
initializeSocket(server); // This function should log its own success
console.log('index.js: Socket.IO initialization called.');

// Connect to database
console.log('index.js: Connecting to database...');
connectDB(); // This function should log its own success/failure
console.log('index.js: Database connection called.');

// --- Middleware ---
console.log('index.js: Setting up middleware...');

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production'
         ? process.env.FRONTEND_URL
         : ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:5174', 'https://*.render.com'];

console.log('index.js: CORS Allowed Origins:', allowedOrigins);

app.use(cors({
  origin: allowedOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));
console.log('index.js: CORS middleware applied.');

// Body parsers
app.use(express.json());
console.log('index.js: express.json() middleware applied.');
app.use(express.urlencoded({ extended: true }));
console.log('index.js: express.urlencoded() middleware applied.');


// --- Static File Serving ---
console.log('index.js: Setting up static file serving...');
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
console.log('index.js: Frontend build path calculated:', frontendBuildPath);

app.use(express.static(frontendBuildPath));
console.log('index.js: express.static() middleware applied for frontend build path.');


// --- Routes ---
console.log('index.js: Setting up API routes...');
// API routes
// The error is likely triggered when one of these app.use calls attempts to load routes with invalid syntax
console.log('index.js: Applying /api/challenges routes...');
app.use('/api/challenges', challengeRoutes);
console.log('index.js: /api/challenges routes applied.'); // If the error happens between this and the next log, the issue is in challengeRoutes

console.log('index.js: Applying /api/test routes...');
app.use('/api/test', testRoutes);
console.log('index.js: /api/test routes applied.'); // If error here, issue in testRoutes

console.log('index.js: Applying /api/championships routes...');
app.use('/api/championships', championshipRoutes);
console.log('index.js: /api/championships routes applied.'); // If error here, issue in championshipRoutes

console.log('index.js: Applying /api/chats routes...');
app.use('/api/chats', chatRoutes);
console.log('index.js: /api/chats routes applied.'); // If error here, issue in chatRoutes

console.log('index.js: Applying /api/auth routes...');
app.use('/api/auth', authRoutes);
console.log('index.js: /api/auth routes applied.'); // If error here, issue in authRoutes

console.log('index.js: Applying /api/profile routes...');
app.use('/api/profile', profileRoutes);
console.log('index.js: /api/profile routes applied.'); // If error here, issue in profileRoutes

console.log('index.js: Applying /api/leaderboard routes...');
app.use('/api/leaderboard', leaderboardRoutes);
console.log('index.js: /api/leaderboard routes applied.'); // If error here, issue in leaderboardRoutes
console.log('index.js: Finished setting up API routes.');


// --- SPA Fallback Route ---
console.log('index.js: Setting up SPA fallback route...');
// app.get('*', (req, res) => {
//   // Check if the request path is an API route (Render health checks might hit '/')
//   if (req.path.startsWith('/api/')) {
//      // Already handled by the 404 middleware below if no API route matched
//      // So this block might not be strictly necessary depending on middleware order,
//      // but keeps the intent clear. We let the 404 middleware handle unmatched /api paths.
//      return;
//   }
//   // For all other paths, serve the index.html
//   // Ensure the file exists at the calculated path
//   const indexPath = path.join(frontendBuildPath, 'index.html');
//   console.log(`index.js: Serving index.html for path: ${req.originalUrl} from ${indexPath}`);
//   res.sendFile(indexPath);
// });
// console.log('index.js: SPA fallback route applied.');


// Health check route (explicitly defined, less likely to cause parameter error)
console.log('index.js: Setting up health check route...');
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    status: 'Healthy',
    timestamp: new Date().toISOString(),
    databaseState: dbState === 1 ? 'Connected' : `State ${dbState}`
  });
});
console.log('index.js: Health check route applied.');


// --- Error Handling ---
console.log('index.js: Setting up error handling middleware...');
// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    console.warn(`index.js: API 404: ${req.originalUrl}`);
    return res.status(404).json({
      message: "API endpoint not found",
      path: req.originalUrl
    });
  }
  // If it's not an /api path, the '*' route or other middleware will handle it
  next();
});
console.log('index.js: API 404 middleware applied.');


// Error handler
app.use((err, req, res, next) => {
  console.error("index.js: General Error Handler:", err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});
console.log('index.js: General error handler applied.');
console.log('index.js: Middleware and route setup complete.');


// --- Server Startup ---
console.log('index.js: Preparing server startup...');
// Start server in local development mode
// NOTE: Render handles the server listening in production via process.env.PORT
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  console.log(`index.js: Running in development mode. Starting server on port ${PORT}...`);
  // Use the HTTP server (which Express is attached to) to listen
  server.listen(PORT, () => {
    console.log(`index.js: Server running on port ${PORT}`);
    console.log('--- index.js: Server started successfully ---');
  });
} else {
  console.log('index.js: Running in production mode. Render will handle server listening.');
  // In production, Render sets the PORT env var and handles the listen call internally
  // or expects the app to be exported (depending on service type, Web Service usually expects listen).
  // Your server.listen call inside the if block covers dev.
  // For Render Web Service, the 'start' command just needs to keep the Node process alive.
  // The server.listen outside the if block handles this for Render.
  const PORT = process.env.PORT || 3000; // Fallback just in case
   server.listen(PORT, () => {
     console.log(`index.js: Production server listening on port ${PORT}`);
     console.log('--- index.js: Production server started successfully ---');
   });
}

// Export the Express app for serverless handling (optional for Render Web Service but harmless)
// module.exports = app; // Not strictly needed for Render Web Service with server.listen
console.log('--- index.js: Script end (synchronous execution complete) ---'); // Code below this line runs async
