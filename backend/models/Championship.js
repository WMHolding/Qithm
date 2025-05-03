const mongoose = require("mongoose");

const championshipSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  image: { type: String, required: true },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    points: { type: Number, default: 0 },
    rank: { type: Number },
    status: { 
      type: String, 
      enum: ['active', 'completed', 'dropped'],
      default: 'active'
    }
  }],
  prizes: [{
    rank: { type: Number },
    description: { type: String }
  }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Championship", championshipSchema);
