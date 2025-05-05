// backend/models/User.js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true // Add trim
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Add trim
    lowercase: true, // Store emails in lowercase
    match: [/.+@.+\..+/, 'Please fill a valid email address'] // Basic email format validation
  },
  password: {
    type: String,
    required: true,
    minlength: 8 // Add min length validation
  },
  // Use one field for profile picture with a default URL
  profilePicture: {
    type: String,
    // Using a placeholder service is good for deployment.
    // Replace with your hosted default image URL if you have one.
    default: 'https://via.placeholder.com/150?text=Default+Avatar'
  },
  role: {
    type: String,
    enum: ['user', 'coach', 'admin'],
    default: 'user'
  },

  // --- Additional Fields (Keep existing ones) ---
  birthday: { type: Date },
  weight: { type: String },
  height: { type: String },
  phone: { type: String },
  //for leaderboard
  steps: { type: Number, default: 0 }, // for walking
  resistanceHours: { type: Number, default: 0 }, // for resistance training
  streak: { type: Number, default: 0 },

  points: { type: Number, default: 0 }, // save the points for leaderboard

    // connect with the challenge schema
  enrolledChallenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }]

}, { timestamps: true }); // timestamps adds createdAt and updatedAt

module.exports = mongoose.model("User", userSchema)
