// script.js
let workMinutes = 25;
let breakMinutes = 5;
let isWorkSession = true;
let isPaused = true;
let intervalID;
let minutes = workMinutes;
let seconds = 0;

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const sessionDisplay = document.querySelector(".session");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const themeToggleCheckbox = document.getElementById("theme-toggle-checkbox");
const workAlarm = document.getElementById("work-alarm");
const breakAlarm = document.getElementById("break-alarm");
const startSound = document.getElementById("start-sound");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login");
const registerButton = document.getElementById("register");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const closeAuthButton = document.getElementById("close-auth");
const authForm = document.getElementById("auth-form");
const experienceDisplay = document.getElementById("experience");
const achievementsDisplay = document.getElementById("achievements");
const profileBtn = document.getElementById("profile-btn");
const friendsBtn = document.getElementById("friends-btn");
const homeBtn = document.getElementById("home-btn");
const profileForm = document.getElementById("profile-form");
const bioInput = document.getElementById("bio");
const avatarInput = document.getElementById("avatar");
const profileUsername = document.getElementById("profile-username");
const profileBio = document.getElementById("profile-bio");
const profileAvatar = document.getElementById("profile-avatar");
const searchFriendsInput = document.getElementById("search-friends");
const searchBtn = document.getElementById("search-btn");
const friendsList = document.getElementById("friends-list");
const yourFriendsList = document.getElementById("your-friends-list");
const profilePic = document.getElementById("profile-pic");

let userId = null;

async function apiRequest(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

function updateDisplay() {
  minutesDisplay.textContent = String(minutes).padStart(2, "0");
  secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

function startTimer() {
  if (isPaused) {
    startSound.play();
    isPaused = false;
    intervalID = setInterval(updateTimer, 1000);
  }
}

function pauseTimer() {
  isPaused = true;
  clearInterval(intervalID);
}

function resetTimer() {
  pauseTimer();
  isWorkSession = true;
  minutes = workMinutes;
  seconds = 0;
  sessionDisplay.textContent = "Work Session";
  updateDisplay();
}

async function switchSession() {
  if (isWorkSession) {
    workAlarm.play();
  } else {
    breakAlarm.play();
  }
  isWorkSession = !isWorkSession;
  minutes = isWorkSession ? workMinutes : breakMinutes;
  seconds = 0;
  sessionDisplay.textContent = isWorkSession ? "Work Session" : "Break Session";

  await trackSession();
}

function updateTimer() {
  if (seconds === 0) {
    if (minutes === 0) {
      switchSession();
    } else {
      minutes--;
      seconds = 59;
    }
  } else {
    seconds--;
  }
  updateDisplay();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

async function register() {
  const user = await apiRequest("/register", "POST", {
    username: usernameInput.value,
    password: passwordInput.value,
  });
  userId = user._id;
  authForm.style.display = "none";
}

async function login() {
  const user = await apiRequest("/login", "POST", {
    username: usernameInput.value,
    password: passwordInput.value,
  });
  userId = user._id;
  experienceDisplay.textContent = `Experience: ${user.experience}`;
  fetchAchievements();
  authForm.style.display = "none";
}

async function trackSession() {
  const session = await apiRequest("/session", "POST", {
    userId,
    duration: workMinutes * 60,
    type: isWorkSession ? "work" : "break",
  });
  // Update experience points and fetch achievements
  const user = await apiRequest(`/login`, "POST", {
    username: usernameInput.value,
    password: passwordInput.value,
  });
  experienceDisplay.textContent = `Experience: ${user.experience}`;
  fetchAchievements();
}

async function fetchAchievements() {
  const achievements = await apiRequest(`/achievements/${userId}`, "GET");
  achievementsDisplay.textContent = `Achievements: ${achievements
    .map((a) => a.title)
    .join(", ")}`;
}

async function updateProfile(event) {
  event.preventDefault();
  const user = await apiRequest(`/profile/${userId}`, "PUT", {
    profile: {
      bio: bioInput.value,
      avatar: avatarInput.value,
    },
  });
  profileUsername.textContent = user.username;
  profileBio.textContent = user.profile.bio;
  profileAvatar.src = user.profile.avatar;
}

async function searchFriends() {
  const friends = await apiRequest(
    `/friends/search?username=${searchFriendsInput.value}`,
    "GET"
  );
  friendsList.innerHTML = "";
  friends.forEach((friend) => {
    const li = document.createElement("li");
    li.textContent = friend.username;
    const addButton = document.createElement("button");
    addButton.textContent = "Add Friend";
    addButton.addEventListener("click", () => addFriend(friend._id));
    li.appendChild(addButton);
    friendsList.appendChild(li);
  });
}

async function addFriend(friendId) {
  const user = await apiRequest(`/friends/${userId}`, "POST", { friendId });
  yourFriendsList.innerHTML = "";
  user.friends.forEach(async (friend) => {
    const friendUser = await apiRequest(`/profile/${friend}`, "GET");
    const li = document.createElement("li");
    li.textContent = friendUser.username;
    yourFriendsList.appendChild(li);
  });
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
themeToggleCheckbox.addEventListener("change", toggleTheme);
registerButton.addEventListener("click", register);
loginButton.addEventListener("click", login);
profileForm.addEventListener("submit", updateProfile);
searchBtn.addEventListener("click", searchFriends);

loginBtn.addEventListener("click", () => {
  authForm.style.display = "block";
  registerButton.style.display = "none";
  loginButton.style.display = "inline-block";
});

registerBtn.addEventListener("click", () => {
  authForm.style.display = "block";
  loginButton.style.display = "none";
  registerButton.style.display = "inline-block";
});

closeAuthButton.addEventListener("click", () => {
  authForm.style.display = "none";
});

profileBtn.addEventListener("click", () => {
  window.location.href = "profile.html";
});

friendsBtn.addEventListener("click", () => {
  window.location.href = "friends.html";
});

homeBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

profilePic.addEventListener("click", () => {
  window.location.href = "profile.html";
});

updateDisplay();

console.log("TEST");
