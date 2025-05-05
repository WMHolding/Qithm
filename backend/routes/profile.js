// backend/routes/profile.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware"); // Assuming your auth middleware path

// --- User Search Endpoint ---
// GET /api/profile/search?q=<search_query>
// PROTECTED ROUTE: Needs auth middleware
// MUST be defined BEFORE GET /:userId
router.get('/search', auth, async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const currentUserId = req.user.userId; // Get current user ID from auth middleware

    if (!searchQuery || searchQuery.trim().length === 0) {
      console.log("Profile Search: Empty query received, returning empty array.");
      return res.status(200).json([]); // Return empty array immediately if no query
    }

    console.log(`Profile Search: Searching for users with query "${searchQuery}" (excluding user ${currentUserId})`);

    // Escape special characters in the query for robust regex search
    const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Case-insensitive search for username or email
    // Also exclude the current user from search results
    const users = await User.find({
      _id: { $ne: currentUserId }, // Exclude current user
      $or: [
        { username: { $regex: escapedSearchQuery, $options: 'i' } },
        { email: { $regex: escapedSearchQuery, $options: 'i' } }
      ]
    })
    // Select only necessary fields for chat sidebar display
    .select('_id username profilePicture role')
    .limit(20); // Limit results for performance (adjust as needed)

    console.log(`Profile Search: Found ${users.length} users.`);

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error.message);
     // Check for CastError (unlikely here, but good practice)
     if (error.name === 'CastError') {
         return res.status(400).json({ message: "Invalid input format for search query" }); // Adjust message
     }
    res.status(500).json({ message: 'Server Error while searching users' });
  }
});


// --- Get User Profile by ID ---
// GET /api/profile/:userId
// PROTECTED ROUTE: Needs auth middleware
// MUST be defined AFTER GET /search
router.get("/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
     console.log(`Profile: Fetching profile for user ID: ${userId}`);

    // Validate if the provided userId is a valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
       console.log(`Profile: Invalid user ID format received: ${userId}`);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId).select("-password"); // Exclude password field
    if (!user) {
       console.log(`Profile: User not found for ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the authenticated user is allowed to view this profile if necessary
    // For simplicity, we'll allow viewing if the user is found and request is authenticated.

    console.log(`Profile: Successfully fetched profile for user ID: ${userId}`);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
     // Check for CastError if ObjectId format was unexpected but passed initial check (less common)
     if (error.name === 'CastError') {
         // This might happen if isValid passed but Mongoose itself has issues casting
         return res.status(400).json({ message: "Invalid user ID format (casting error)" });
     }
    res.status(500).json({ message: 'Server Error while fetching user profile' });
  }
});

// --- Update User Profile ---
// PUT /api/profile/:userId
// PROTECTED ROUTE: Needs auth middleware
// ONLY the user themselves should be able to update their profile
router.put("/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.userId; // From auth middleware
     console.log(`Profile Update: Attempting update for user ID: ${userId} by user ${currentUserId}`);

    // Ensure the authenticated user is updating their *own* profile
    if (currentUserId !== userId) {
       console.log(`Profile Update: Unauthorized attempt - User ${currentUserId} tried to update ${userId}`);
       return res.status(403).json({ message: "Unauthorized: You can only update your own profile" });
    }

    // Validate if the provided userId is a valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log(`Profile Update: Invalid user ID format received: ${userId}`);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Prevent updating sensitive fields via this route
    const updates = { ...req.body };
    // List fields that should NOT be updatable via PUT /:userId
    delete updates._id;
    delete updates.email; // Email changes usually require verification
    delete updates.password; // Password changes should use a dedicated route
    delete updates.role; // Role changes require admin privileges

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates }, // Use $set to update only specified fields
      { new: true, runValidators: true } // Return the updated document and run schema validators
    ).select("-password"); // Exclude password field from the response

    if (!user) {
       console.log(`Profile Update: User not found for ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`Profile Update: Successfully updated profile for user ID: ${userId}`);
    res.json(user);

  } catch (error) {
    console.error("Error updating user profile:", error.message);
     // Handle validation errors (e.g., unique constraint violations)
     if (error.name === 'ValidationError') {
         console.log("Profile Update: Validation Error:", error.message);
         return res.status(400).json({ message: error.message });
     }
     if (error.name === 'CastError') {
          console.log("Profile Update: Cast Error:", error.message);
         return res.status(400).json({ message: "Invalid user ID format" });
     }
    res.status(500).json({ message: 'Server Error while updating user profile' });
  }
});


module.exports = router;
