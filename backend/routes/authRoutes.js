// backend/routes/authRoutes.js (Backend)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if needed
const auth = require('../middleware/authMiddleware'); // Import the auth middleware
const router = express.Router();

// --- User Signup ---
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body; // Assuming role might be sent here (handle carefully)

    // Simple validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if user exists (case-insensitive email/username)
    const existingUser = await User.findOne({ $or: [{ email: new RegExp(`^${email}$`, 'i') }, { username: new RegExp(`^${username}$`, 'i') }] });

    if (existingUser) {
        // Provide more specific error message based on which field is duplicated
        if (existingUser.email.toLowerCase() === email.toLowerCase()) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        if (existingUser.username.toLowerCase() === username.toLowerCase()) {
             return res.status(400).json({ message: 'Username already taken' });
        }
        return res.status(400).json({ message: 'User already exists' }); // Fallback
    }


    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
       // Only set role if explicitly allowed and handled securely,
       // otherwise default to 'user' in your User model schema
       role: role || 'user' // Basic example - implement proper role handling
    });

    await user.save();

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h' // Token valid for 24 hours
    });

    // Return token and user data (excluding password)
    res.status(201).json({ token, user: { _id: user._id, username: user.username, email: user.email, role: user.role, profilePicture: user.profilePicture } });

  } catch (error) {
    console.error("Error during signup:", error.message);
     // Handle potential database errors (e.g., validation errors not caught above)
     if (error.name === 'ValidationError') {
         return res.status(400).json({ message: error.message });
     }
    res.status(500).json({ message: 'Server Error during signup' });
  }
});

// --- User Login ---
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // Usually log in with email or username

     // Simple validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email and password' });
    }


    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Use generic message
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Use generic message
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h' // Token valid for 24 hours
    });

    // Return token and user data (excluding password)
    res.json({ token, user: { _id: user._id, username: user.username, email: user.email, role: user.role, profilePicture: user.profilePicture } });

  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: 'Server Error during login' });
  }
});

// --- Get Current User (Protected Route) ---
// GET /api/auth/me
// Uses the extracted auth middleware
router.get('/me', auth, async (req, res) => {
  try {
    // The auth middleware has already verified the token and attached req.user.userId
    const user = await User.findById(req.user.userId).select('-password'); // Find user by ID from token payload
    if (!user) {
      // This case should ideally not happen if auth middleware found the user,
      // but it's a safeguard if the user was deleted after token creation.
      return res.status(404).json({ message: 'User not found' });
    }
    // Return user data (excluding password)
    res.json(user);
  } catch (error) {
    console.error("Error fetching current user ('/me'):", error.message);
    res.status(500).json({ message: 'Server Error fetching current user' });
  }
});


module.exports = router;
