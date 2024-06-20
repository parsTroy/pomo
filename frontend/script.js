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

function switchSession() {
  if (isWorkSession) {
    workAlarm.play();
  } else {
    breakAlarm.play();
  }
  isWorkSession = !isWorkSession;
  minutes = isWorkSession ? workMinutes : breakMinutes;
  seconds = 0;
  sessionDisplay.textContent = isWorkSession ? "Work Session" : "Break Session";
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

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
themeToggleCheckbox.addEventListener("change", toggleTheme);

updateDisplay();
