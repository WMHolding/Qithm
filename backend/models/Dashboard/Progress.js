const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const progressSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["cardio", "resistance"] // Types of progress tracked
    },
    value: {
        type: Number,
        required: true
    },
    unit: {
        type: String, // e.g., 'km', 'minutes'
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now // Records the date of the progress entry
    }
});

// Indexing for efficient querying of progress by user and date range
progressSchema.index({ userId: 1, date: -1 });
progressSchema.index({ userId: 1, type: 1, date: -1 });

module.exports = mongoose.model("Progress", progressSchema);


// Fields Explained:
// userId: Links the progress entry to a specific user.
// type: Specifies the activity type (cardio or resistance).
// value: The amount of progress made (e.g., 5 km, 30 minutes).
// unit: The unit of measurement for the value.
// date: The date the progress was achieved/logged.

// This schema allows you to store individual progress entries.
// You would then aggregate these entries (e.g., sum up values for the past week)
// in your backend logic to display the weekly progress as shown in the WeeklyProgress.jsx component.