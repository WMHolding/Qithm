// models/Challenge.js
const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  // id: { type: String, required: true, unique: true }, // --- REMOVED THIS LINE ---
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  category: { type: String, enum: ['cardio', 'strength'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  image: { type: String, required: true },

  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Number, default: 0 },
    // Consider adding a default here if progressGoal isn't always sent by frontend
    progressGoal: { type: Number, required: true, default: 100 },
    streak: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped'],
      default: 'active'
    },
    enrollmentDate: { type: Date, default: Date.now } // Keep enrollment date
  }],

  requirements: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
  defaultProgressGoal: { type: Number, default: 100 } // Added a potential default

}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  // Ensure virtuals are included when converting to JSON or Object
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- ADDED VIRTUAL PROPERTY ---
// Create a virtual 'id' field that gets the string version of '_id'.
// This doesn't get saved to the database but will be present in JSON responses.
challengeSchema.virtual('id').get(function() {
  // 'this' refers to the document instance
  return this._id.toHexString();
});

module.exports = mongoose.model("Challenge", challengeSchema);
