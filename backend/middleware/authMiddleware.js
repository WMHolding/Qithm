// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model path is correct relative to middleware

const authMiddleware = async (req, res, next) => {
  // Get token from header (either 'x-auth-token' or 'Authorization: Bearer <token>')
  const token = req.header('x-auth-token') || (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ') ? req.headers['authorization'].split(' ')[1] : null);

  console.log(`Auth Middleware: Incoming request to ${req.path}`);
   console.log(`Auth Middleware: Token received?`, !!token);
   console.log(`Auth Middleware: Token value (first 10 chars):`, token ? token.substring(0, 10) + '...' : 'None');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth Middleware: Token verified. Decoded payload:", decoded);

    // Attach user ID and potentially other info from the token payload to the request
    // Based on your jwt.sign({ userId: user._id }, ...), the payload is { userId: '...' }
    // So we attach req.user = { userId: '...' }
    req.user = { userId: decoded.userId };

    // Optional: Fetch the full user document and attach it (less common for every request)
    // const user = await User.findById(decoded.userId).select('-password');
    // if (!user) {
    //     return res.status(401).json({ message: 'User not found (from token lookup)' });
    // }
    // req.user = user; // Attach full user object

    next(); // Proceed to the next middleware or route handler

  } catch (err) {
     console.error('Auth middleware error:', err.message);
     // Handle different JWT errors (e.g., expired token)
     if (err.name === 'TokenExpiredError') {
         return res.status(401).json({ message: 'Token expired' });
     }
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware; // Export the middleware function
