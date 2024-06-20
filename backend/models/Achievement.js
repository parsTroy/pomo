const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Achievement", achievementSchema);
