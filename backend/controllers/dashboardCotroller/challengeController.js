// /home/ubuntu/backend_code/controllers/challengeController.js
const Challenge = require("../../models/Dashboard/Challenge");
const asyncHandler = require("express-async-handler");

// @desc    Fetch all challenges
// @route   GET /api/challenges
// @access  Public (or Private, depending on app logic)
const getAllChallenges = asyncHandler(async (req, res) => {
    // Basic implementation: Fetch all challenges
    // TODO: Add filtering (e.g., by category from req.query), pagination
    const challenges = await Challenge.find({});
    res.json(challenges);
});

// @desc    Fetch single challenge by ID
// @route   GET /api/challenges/:id
// @access  Public (or Private)
const getChallengeById = asyncHandler(async (req, res) => {
    const challenge = await Challenge.findById(req.params.id);

    if (challenge) {
        res.json(challenge);
    } else {
        res.status(404);
        throw new Error("Challenge not found");
    }
});

// Add other challenge-related controllers here (e.g., create, update, delete) if needed
// const createChallenge = asyncHandler(async (req, res) => { ... });
// const updateChallenge = asyncHandler(async (req, res) => { ... });
// const deleteChallenge = asyncHandler(async (req, res) => { ... });

module.exports = {
    getAllChallenges,
    getChallengeById,
    // Export other controllers if implemented
};
