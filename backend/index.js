const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const challengeRoutes = require('./routes/challenges');
const testRoutes = require('./routes/test');
const championshipRoutes = require('./routes/championships');
const http = require('http');
const initializeSocket = require('./socket');
const chatRoutes = require('./routes/chats');
const authRoutes = require('./routes/authRoutes'); // Adjust path
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to FitComp!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'Healthy' });
});

app.use('/api/challenges', challengeRoutes);
app.use('/api/test', testRoutes);
app.use('/api/championships', championshipRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/auth', authRoutes); 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`DB connected: ${process.env.MONGODB_URI}`);
});
