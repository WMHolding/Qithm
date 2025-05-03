const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  category: { type: String, enum: ['cardio', 'strength'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  image: { type: String, required: true },
  
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Number, default: 0 },
    progressGoal: { type: Number, required: true },
    streak: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ['active', 'completed', 'dropped'],
      default: 'active'
    }
  }],

  requirements: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date }
}, {
  timestamps: true,
  toJSON: true,
  toObject: true
});

module.exports = mongoose.model("Challenge", challengeSchema);
