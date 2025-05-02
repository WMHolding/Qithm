const mongoose = require("mongoose");

const championshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startDate: { type: Date },
  endDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Championship", championshipSchema);
