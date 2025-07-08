//DOMs
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const skipButton = document.getElementById("skip");
const modeDisplay = document.getElementById("mode");
const pomodoroCountDisplay = document.getElementById("pomodoro-count");

// Constants for durations (in seconds)
const WORK_DURATION = 25 * 60; // 25 minutes
const SHORT_BREAK_DURATION = 5 * 60; // 5 minutes
const LONG_BREAK_DURATION = 15 * 60; // 15 minutes

// Timer state variables
let timeLeft = WORK_DURATION;
let timer;
let isRunning = false;
let isWorkSession = true; // true = work, false = break
let pomodoroCount = 0; // Completed pomodoros count

// Update the timer display
function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Update mode text and skip button state
function updateModeDisplay() {
  if (isWorkSession) {
    modeDisplay.textContent = "Work Time";
    modeDisplay.classList.remove("break");
    skipButton.disabled = true; // can't skip work sessions
  } else {
    if (pomodoroCount % 4 === 0 && pomodoroCount !== 0) {
      modeDisplay.textContent = "Long Break";
    } else {
      modeDisplay.textContent = "Short Break";
    }
    modeDisplay.classList.add("break");
    skipButton.disabled = false; // can skip breaks
  }
}

// Update Pomodoro count display
function updatePomodoroCountDisplay() {
  pomodoroCountDisplay.textContent = `Pomodoros Completed: ${pomodoroCount}`;
}

// Update Start/Pause button enabled state for UX
function updateButtons() {
  startButton.disabled = isRunning;
  pauseButton.disabled = !isRunning;
}

// Start or resume the timer
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    updateButtons();

    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        updateButtons();

        if (isWorkSession) {
          pomodoroCount++;
          isWorkSession = false;

          if (pomodoroCount % 4 === 0) {
            timeLeft = LONG_BREAK_DURATION;
            alert("Great job! Time for a long break (15 min).");
          } else {
            timeLeft = SHORT_BREAK_DURATION;
            alert("Time's up! Take a short break (5 min).");
          }
        } else {
          isWorkSession = true;
          timeLeft = WORK_DURATION;
          alert("Break's over! Back to work.");
        }

        updateDisplay();
        updateModeDisplay();
        updatePomodoroCountDisplay();
        startTimer(); // Automatically start next session
      }
    }, 1000);
  }
}

// Pause the timer
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  updateButtons();
}

// Reset timer and count fully
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorkSession = true;
  timeLeft = WORK_DURATION;
  pomodoroCount = 0;
  updateDisplay();
  updateModeDisplay();
  updatePomodoroCountDisplay();
  updateButtons();
}

// Skip the current break and start work session immediately
function skipBreak() {
  if (!isWorkSession) {
    if (confirm("Skip the break and start working?")) {
      console.log("Skipping break...");
      clearInterval(timer);
      isRunning = false;
      isWorkSession = true;
      timeLeft = WORK_DURATION;
      updateDisplay();
      updateModeDisplay();
      updatePomodoroCountDisplay();
      updateButtons();
      console.log("Calling startTimer(), isRunning =", isRunning);
      startTimer();
    }
  }
}

// Attach event listeners
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
skipButton.addEventListener("click", skipBreak);

// Initialize UI on page load
updateDisplay();
updateModeDisplay();
updatePomodoroCountDisplay();
updateButtons();

