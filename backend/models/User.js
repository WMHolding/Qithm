const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'coach', 'admin'], default: 'user' },

  avatar: { type: String }, // the usrl

  points: { type: Number, default: 0 }, // save the points for leaderboard

    // connect with the challenge schema 
  challengesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }]

}, { timestamps: true });


module.exports = mongoose.model("User", userSchema)