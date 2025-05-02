// /home/ubuntu/backend_code/controllers/progressController.js
const Progress = require("../../models/Progress");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose"); // Needed for ObjectId validation

// @desc    Add a new progress entry
// @route   POST /api/progress
// @access  Private
const addProgress = asyncHandler(async (req, res) => {
    const { type, value, unit, date } = req.body;
    const userId = req.user.id; // Assuming protect middleware adds user ID

    // Basic validation
    if (!type || !value || !unit) {
        res.status(400);
        throw new Error("Missing required fields: type, value, unit");
    }
    if (typeof value !== "number" || value < 0) {
        res.status(400);
        throw new Error("Invalid value for progress");
    }
    if (!["cardio", "resistance"].includes(type)) {
        res.status(400);
        throw new Error("Invalid progress type");
    }

    const progressEntry = new Progress({
        userId,
        type,
        value,
        unit,
        date: date ? new Date(date) : Date.now() // Use provided date or default to now
    });

    const createdProgress = await progressEntry.save();

    // Optional: Update related ChallengeEnrollment progress if applicable
    // This might require more complex logic to find relevant active enrollments
    // based on the type of progress being added.

    res.status(201).json(createdProgress);
});

// @desc    Get aggregated weekly progress for the logged-in user
// @route   GET /api/progress/weekly
// @access  Private
const getWeeklyProgress = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Calculate the date 7 days ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Aggregate progress entries for the last 7 days by type
    const weeklyAggregation = await Progress.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId), // Match the user ID
                date: { $gte: oneWeekAgo } // Filter entries from the last 7 days
            }
        },
        {
            $group: {
                _id: "$type", // Group by progress type (cardio, resistance)
                totalValue: { $sum: "$value" }, // Sum the values for each type
                unit: { $first: "$unit" } // Get the unit (assuming unit is consistent per type)
            }
        }
    ]);

    // Format the results to match frontend expectations (WeeklyProgress.jsx)
    // This assumes fixed goals for now. In a real app, goals might come from user settings or elsewhere.
    const progressData = {
        cardio: { current: 0, goal: 30, percentage: 0, unit: "km" }, // Example goal
        resistance: { current: 0, goal: 20, percentage: 0, unit: "min" } // Example goal
    };

    weeklyAggregation.forEach(item => {
        if (item._id === "cardio") {
            progressData.cardio.current = parseFloat(item.totalValue.toFixed(1));
            progressData.cardio.unit = item.unit || "km";
            progressData.cardio.percentage = progressData.cardio.goal > 0
                ? Math.min(100, Math.round((progressData.cardio.current / progressData.cardio.goal) * 100))
                : 0;
        } else if (item._id === "resistance") {
            progressData.resistance.current = parseFloat(item.totalValue.toFixed(1));
            progressData.resistance.unit = item.unit || "min";
            progressData.resistance.percentage = progressData.resistance.goal > 0
                ? Math.min(100, Math.round((progressData.resistance.current / progressData.resistance.goal) * 100))
                : 0;
        }
    });

    res.json(progressData);
});

// @desc    Get progress history for the logged-in user
// @route   GET /api/progress/history
// @access  Private
const getProgressHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Basic implementation: Fetch all progress for the user, sorted by date
    // TODO: Add pagination and filtering (date range, type) based on req.query
    const history = await Progress.find({ userId: userId })
        .sort({ date: -1 }); // Most recent first

    res.json(history);
});

module.exports = {
    addProgress,
    getWeeklyProgress,
    getProgressHistory,
};
