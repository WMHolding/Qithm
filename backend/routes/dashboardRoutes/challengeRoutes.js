// /home/ubuntu/backend_code/routes/challengeRoutes.js
const express = require("express");
const router = express.Router();

// Placeholder for authentication middleware
const protect = (req, res, next) => {
    console.log("Protect middleware called (placeholder)");
    req.user = { id: "replace_with_actual_user_id" }; // Example
    next();
};

// Placeholder for admin check middleware (if needed for create/update/delete)
const admin = (req, res, next) => {
    console.log("Admin check middleware called (placeholder)");
    // Check if req.user is an admin
    // if (req.user && req.user.isAdmin) { // Assuming user object has isAdmin flag
    //     next();
    // } else {
    //     res.status(403).json({ message: "Not authorized as an admin" });
    // }
    next(); // For now, allow access
};

// Placeholder for controller functions (to be implemented in step 006)
const challengeController = {
    getAllChallenges: (req, res) => {
        res.status(501).json({ message: "Get All Challenges controller not implemented yet." });
    },
    getChallengeById: (req, res) => {
        res.status(501).json({ message: "Get Challenge By ID controller not implemented yet." });
    },
    // Add controllers for create, update, delete if needed
    // createChallenge: (req, res) => { ... },
    // updateChallenge: (req, res) => { ... },
    // deleteChallenge: (req, res) => { ... },
};

// --- Challenge Routes ---

// GET /api/challenges - Get all challenges (or filtered by category, etc.)
// Public or requires authentication depending on app logic
router.get("/", challengeController.getAllChallenges);

// GET /api/challenges/:id - Get a single challenge by ID
// Public or requires authentication
router.get("/:id", challengeController.getChallengeById);

// Example Admin routes (if needed):
// POST /api/challenges - Create a new challenge (Admin only)
// router.post("/", protect, admin, challengeController.createChallenge);

// PUT /api/challenges/:id - Update a challenge (Admin only)
// router.put("/:id", protect, admin, challengeController.updateChallenge);

// DELETE /api/challenges/:id - Delete a challenge (Admin only)
// router.delete("/:id", protect, admin, challengeController.deleteChallenge);

module.exports = router;
