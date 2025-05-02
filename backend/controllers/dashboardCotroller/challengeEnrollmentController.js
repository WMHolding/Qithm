// /home/ubuntu/backend_code/controllers/challengeEnrollmentController.js
const ChallengeEnrollment = require("../../models/ChallengeEnrollment");
const Challenge = require("../../models/Challenge"); // Needed for validation/endDate calculation
const asyncHandler = require("express-async-handler");

// @desc    Enroll logged-in user in a challenge
// @route   POST /api/enrollments
// @access  Private
const enrollInChallenge = asyncHandler(async (req, res) => {
    const { challengeId } = req.body;
    const userId = req.user.id; // Assuming protect middleware adds user ID

    if (!challengeId) {
        res.status(400);
        throw new Error("Challenge ID is required");
    }

    // Check if the challenge exists
    const challengeExists = await Challenge.findById(challengeId);
    if (!challengeExists) {
        res.status(404);
        throw new Error("Challenge not found");
    }

    // Check if user is already enrolled
    const existingEnrollment = await ChallengeEnrollment.findOne({ userId, challengeId });
    if (existingEnrollment) {
        res.status(400);
        throw new Error("Already enrolled in this challenge");
    }

    // Create enrollment - endDate will be calculated by the pre-save hook in the model
    const enrollment = new ChallengeEnrollment({
        userId,
        challengeId,
        // startDate defaults to Date.now()
        // status defaults to "enrolled"
        // progress defaults to 0
    });

    const createdEnrollment = await enrollment.save();
    res.status(201).json(createdEnrollment);
});

// @desc    Get active enrollments for the logged-in user
// @route   GET /api/enrollments/my/active
// @access  Private
const getMyActiveEnrollments = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const enrollments = await ChallengeEnrollment.find({
        userId: userId,
        status: "enrolled"
    })
        .populate("challengeId") // Populate challenge details
        .sort({ startDate: -1 }); // Sort by most recent enrollment first

    // Map to match frontend expectations (e.g., ActiveChallenges.jsx)
    const activeChallengesData = enrollments.map(enrollment => {
        if (!enrollment.challengeId) return null; // Handle case where challenge might be deleted

        const challenge = enrollment.challengeId;
        const progressPercent = challenge.progressGoal > 0 ? (enrollment.progress / challenge.progressGoal) * 100 : 0;
        const hoursLeft = enrollment.endDate ? Math.max(0, Math.round((enrollment.endDate - Date.now()) / (1000 * 60 * 60))) : Infinity;

        return {
            id: enrollment._id, // Enrollment ID
            challengeId: challenge._id,
            title: challenge.title,
            image: challenge.image,
            rank: enrollment.rank || "N/A", // Use enrollment rank if available
            hoursLeft: hoursLeft,
            progress: enrollment.progress,
            progressGoal: challenge.progressGoal,
            progressPercent: Math.min(100, Math.round(progressPercent)), // Cap at 100%
            shortDescription: challenge.shortDescription,
            category: challenge.category,
            status: enrollment.status
        };
    }).filter(item => item !== null); // Filter out nulls if challenge was deleted

    res.json(activeChallengesData);
});

// @desc    Get details of a specific enrollment by ID
// @route   GET /api/enrollments/:id
// @access  Private
const getEnrollmentById = asyncHandler(async (req, res) => {
    const enrollment = await ChallengeEnrollment.findById(req.params.id).populate("challengeId").populate("userId", "name email"); // Populate user name/email

    if (enrollment) {
        // Optional: Check if the logged-in user owns this enrollment or is an admin
        if (enrollment.userId._id.toString() !== req.user.id /* && !req.user.isAdmin */) {
            res.status(403);
            throw new Error("Not authorized to view this enrollment");
        }
        res.json(enrollment);
    } else {
        res.status(404);
        throw new Error("Enrollment not found");
    }
});

// @desc    Update progress for a specific enrollment
// @route   PUT /api/enrollments/:id/progress
// @access  Private
const updateEnrollmentProgress = asyncHandler(async (req, res) => {
    const { progress } = req.body;
    const enrollmentId = req.params.id;
    const userId = req.user.id;

    if (typeof progress !== "number" || progress < 0) {
        res.status(400);
        throw new Error("Invalid progress value");
    }

    const enrollment = await ChallengeEnrollment.findById(enrollmentId);

    if (!enrollment) {
        res.status(404);
        throw new Error("Enrollment not found");
    }

    // Check if the logged-in user owns this enrollment
    if (enrollment.userId.toString() !== userId) {
        res.status(403);
        throw new Error("Not authorized to update this enrollment");
    }

    // Check if challenge is still active (status enrolled)
    if (enrollment.status !== "enrolled") {
        res.status(400);
        throw new Error(`Cannot update progress for a challenge that is ${enrollment.status}`);
    }

    enrollment.progress = progress;
    enrollment.lastUpdated = Date.now();

    // Optional: Check if progress meets goal and update status
    // const challenge = await Challenge.findById(enrollment.challengeId);
    // if (challenge && enrollment.progress >= challenge.progressGoal) {
    //     enrollment.status = "completed";
    // }

    const updatedEnrollment = await enrollment.save();
    res.json(updatedEnrollment);
});

// @desc    Unenroll user from a challenge (delete enrollment)
// @route   DELETE /api/enrollments/:id
// @access  Private
const unenrollFromChallenge = asyncHandler(async (req, res) => {
    const enrollmentId = req.params.id;
    const userId = req.user.id;

    const enrollment = await ChallengeEnrollment.findById(enrollmentId);

    if (!enrollment) {
        res.status(404);
        throw new Error("Enrollment not found");
    }

    // Check if the logged-in user owns this enrollment
    if (enrollment.userId.toString() !== userId) {
        res.status(403);
        throw new Error("Not authorized to delete this enrollment");
    }

    await enrollment.deleteOne(); // Use deleteOne() on the document

    res.json({ message: "Successfully unenrolled from challenge" });
});

module.exports = {
    enrollInChallenge,
    getMyActiveEnrollments,
    getEnrollmentById,
    updateEnrollmentProgress,
    unenrollFromChallenge,
};
