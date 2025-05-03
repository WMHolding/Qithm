// /home/ubuntu/backend_code/routes/challengeEnrollmentRoutes.js
const express = require("express");
const router = express.Router();

// Placeholder for authentication middleware
const protect = (req, res, next) => {
    console.log("Protect middleware called (placeholder)");
    // In a real app, verify token/session and attach user object
    req.user = { id: "replace_with_actual_user_id" }; // Example: Attach user info
    next();
};

// Placeholder for controller functions (to be implemented in step 006)
const enrollmentController = {
    enrollInChallenge: (req, res) => {
        res.status(501).json({ message: "Enroll In Challenge controller not implemented yet." });
    },
    getMyActiveEnrollments: (req, res) => {
        res.status(501).json({ message: "Get My Active Enrollments controller not implemented yet." });
    },
    getEnrollmentById: (req, res) => {
        res.status(501).json({ message: "Get Enrollment By ID controller not implemented yet." });
    },
    updateEnrollmentProgress: (req, res) => {
        res.status(501).json({ message: "Update Enrollment Progress controller not implemented yet." });
    },
    unenrollFromChallenge: (req, res) => {
        res.status(501).json({ message: "Unenroll From Challenge controller not implemented yet." });
    }
};

// --- Challenge Enrollment Routes ---
// All these routes require authentication

// POST /api/enrollments - Enroll logged-in user in a challenge
// Expects { challengeId: "..." } in request body
router.post("/", protect, enrollmentController.enrollInChallenge);

// GET /api/enrollments/my/active - Get active enrollments for the logged-in user
// Used by ActiveChallenges component
router.get("/my/active", protect, enrollmentController.getMyActiveEnrollments);

// GET /api/enrollments/:id - Get details of a specific enrollment
router.get("/:id", protect, enrollmentController.getEnrollmentById);

// PUT /api/enrollments/:id/progress - Update progress for a specific enrollment
// Expects { progress: number } in request body
// Note: This might overlap with the general Progress model, decide which approach is best.
// Maybe this updates the progress field in ChallengeEnrollment directly.
router.put("/:id/progress", protect, enrollmentController.updateEnrollmentProgress);

// DELETE /api/enrollments/:id - Unenroll user from a challenge
router.delete("/:id", protect, enrollmentController.unenrollFromChallenge);

module.exports = router;
