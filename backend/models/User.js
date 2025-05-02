const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    unique: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  profilePicture: { 
    type: String,
    default: '' 
  },
  role: { type: String, enum: ['user', 'coach', 'admin'], default: 'user' },

  birthday: { type: Date },
  weight: { type: String },
  height: { type: String },
  phone: { type: String },
  
  avatar: { type: String }, // the usrl

  points: { type: Number, default: 0 }, // save the points for leaderboard

    // connect with the challenge schema 
  enrolledChallenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }]

}, { timestamps: true });


module.exports = mongoose.model("User", userSchema)