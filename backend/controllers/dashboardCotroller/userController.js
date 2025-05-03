// /home/ubuntu/backend_code/controllers/userController.js
const User = require("../../models/User");
const asyncHandler = require("express-async-handler"); // Simple middleware for handling exceptions inside of async express routes

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    // Note: The 'protect' middleware should attach the user ID to req.user.id
    // In this placeholder, we'll simulate fetching a user.
    // Replace "replace_with_actual_user_id" with req.user.id in a real implementation
    // const user = await User.findById(req.user.id).select("-password"); // Exclude password

    // --- Placeholder Logic --- 
    // Since we don't have actual user auth yet, let's find *any* user as an example
    // In a real app, you MUST use the authenticated user's ID from req.user.id
    const user = await User.findOne().select("-password"); // Find the first user for demo
    // --- End Placeholder Logic ---

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            rank: user.rank,
            profileImage: user.profileImage,
            createdAt: user.createdAt
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// Add other user-related controllers here (e.g., register, login) if needed

module.exports = {
    getUserProfile,
};
