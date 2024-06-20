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
const experienceDisplay = document.getElementById("experience");
const achievementsDisplay = document.getElementById("achievements");

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
}

async function login() {
  const user = await apiRequest("/login", "POST", {
    username: usernameInput.value,
    password: passwordInput.value,
  });
  userId = user._id;
  experienceDisplay.textContent = `Experience: ${user.experience}`;
  fetchAchievements();
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

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
themeToggleCheckbox.addEventListener("change", toggleTheme);
registerButton.addEventListener("click", register);
loginButton.addEventListener("click", login);

updateDisplay();
