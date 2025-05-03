const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const challengeEnrollmentSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    challengeId: {
        type: Schema.Types.ObjectId,
        ref: "Challenge", // Reference to the Challenge model
        required: true
    },
    status: {
        type: String,
        enum: ["enrolled", "completed", "failed"],
        default: "enrolled"
    },
    progress: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number // Rank within this specific challenge
        // This might need to be calculated dynamically based on other enrollments
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date // Calculated based on challenge duration and start date
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Indexing for faster queries
challengeEnrollmentSchema.index({ userId: 1, challengeId: 1 }, { unique: true }); // User can enroll in a challenge only once
challengeEnrollmentSchema.index({ userId: 1, status: 1 }); // For fetching active challenges per user

// Method to calculate end date (example)
challengeEnrollmentSchema.pre("save", function (next) {
    if (this.isNew) {
        // Find the challenge to get duration
        mongoose.model("Challenge").findById(this.challengeId).then(challenge => {
            if (challenge) {
                const durationInMs = challenge.durationUnit === 'days' ? challenge.duration * 24 * 60 * 60 * 1000 : challenge.duration * 60 * 60 * 1000;
                this.endDate = new Date(this.startDate.getTime() + durationInMs);
            }
            next();
        }).catch(err => next(err));
    } else {
        this.lastUpdated = Date.now();
        next();
    }
});

module.exports = mongoose.model("ChallengeEnrollment", challengeEnrollmentSchema);


// Fields Explained:
// userId, challengeId: Links to the User and Challenge documents.
// status: Tracks if the user is currently 'enrolled', has 'completed', or 'failed' the challenge.
// progress: User's current progress towards the progressGoal of the linked challenge.
// rank: User's rank among participants in this specific challenge (may require separate calculation logic).
// startDate, endDate: Defines the participation period.
// lastUpdated: Tracks when progress was last updated.