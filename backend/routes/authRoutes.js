// routes/authRoutes.js (Backend)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Install: npm install jsonwebtoken
const User = require('../models/User'); // Adjust path if needed
const router = express.Router();

// --- User Signup ---
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body; // Add other fields as needed

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if not provided
      // Add other fields from req.body here
    });

    const savedUser = await newUser.save();

    // Don't send password back
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: 'User created successfully', user: userResponse });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// --- User Login ---
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body; // Or use email for login

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Find user by username (or email)
    const user = await User.findOne({ username }); // Case-sensitive, adjust if needed
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Generic message
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Generic message
    }

    // --- Login successful - Generate JWT Token ---
    const payload = {
      user: {
        id: user.id, // Use user.id which is the string version of _id
        username: user.username,
        role: user.role,
      },
    };

    // Sign the token (use a strong secret from your .env file)
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Add JWT_SECRET to your .env file!
      { expiresIn: '1h' }, // Token expiration time (e.g., 1 hour)
      (err, token) => {
        if (err) throw err;

        // Send user data (without password) and token back
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
          message: 'Login successful',
          token,
          user: userResponse, // Send user details back
        });
      }
    );

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// --- (Optional but Recommended) Get Current User (using token) ---
// Middleware to verify token (create a separate middleware file later)
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token'); // Or get from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Add user payload to request object
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

router.get('/me', authMiddleware, async (req, res) => {
    try {
        // req.user.id was added by authMiddleware
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
