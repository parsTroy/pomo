const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/pomodoro", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require("./models/User");
const Session = require("./models/Session");
const Achievement = require("./models/Achievement");

// User registration
app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
});

// User login
app.post("/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (user) {
    res.send(user);
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Track session
app.post("/session", async (req, res) => {
  const session = new Session(req.body);
  await session.save();
  res.send(session);
});

// Fetch achievements
app.get("/achievements/:userId", async (req, res) => {
  const achievements = await Achievement.find({ userId: req.params.userId });
  res.send(achievements);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
