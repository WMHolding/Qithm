const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  image: {
    type: String, // URL or path to challenge image
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  progressGoal: {
    type: Number,
    required: true
  },
  goalUnit: {
    type: String, // e.g., 'steps', 'km', 'minutes'
    required: true
  },
  duration: {
    type: Number, // Duration value
    required: true
  },
  durationUnit: { // Unit for duration
    type: String, // e.g., 'days', 'hours'
    required: true,
    enum: ["days", "hours"] // Example enum
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Challenge", challengeSchema);

