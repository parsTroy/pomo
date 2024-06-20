const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  duration: Number,
  type: String, // 'work' or 'break'
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);
