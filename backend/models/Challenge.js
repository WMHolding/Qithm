const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },

  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // the user in the challenge
    progress: { type: Number, default: 0 }, // 0 to 100
    completed: { type: Boolean, default: false }
  }],

  startDate: { type: Date },
  endDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Challenge", challengeSchema);
