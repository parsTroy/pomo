const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  experience: { type: Number, default: 0 },
  milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Achievement" }],
});

module.exports = mongoose.model("User", userSchema);
