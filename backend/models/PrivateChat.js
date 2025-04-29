const mongoose = require("mongoose");

const privateChatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],

  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("PrivateChat", privateChatSchema);
