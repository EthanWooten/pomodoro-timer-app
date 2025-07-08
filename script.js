// DOM elements
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const skipButton = document.getElementById("skip");
const modeDisplay = document.getElementById("mode");
const pomodoroCountDisplay = document.getElementById("pomodoro-count");

// Constants
const WORK_DURATION = 25 * 60;
const SHORT_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 15 * 60;

// State
let timeLeft = WORK_DURATION;
let timer = null;
let isRunning = false;
let isWorkSession = true;
let pomodoroCount = 0;

// Update timer display
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Update mode
function updateModeDisplay() {
    if (isWorkSession) {
        modeDisplay.textContent = "Work Time";
        modeDisplay.classList.remove("break");
        skipButton.disabled = true;
    } else {
        modeDisplay.textContent = (pomodoroCount % 4 === 0 && pomodoroCount !== 0) ? "Long Break" : "Short Break";
        modeDisplay.classList.add("break");
        skipButton.disabled = false;
    }
}

// Update pomodoro count
function updatePomodoroCountDisplay() {
    pomodoroCountDisplay.textContent = `Pomodoros Completed: ${pomodoroCount}`;
}

// Update button states
function updateButtons() {
    startButton.disabled = isRunning;
    pauseButton.disabled = !isRunning;
}

// Handle session end cleanly
function handleSessionEnd() {
    if (isWorkSession) {
        pomodoroCount++;
        isWorkSession = false;
        timeLeft = (pomodoroCount % 4 === 0) ? LONG_BREAK_DURATION : SHORT_BREAK_DURATION;
        alert((pomodoroCount % 4 === 0) ? "Great job! Time for a long break (15 min)." : "Time's up! Take a short break (5 min)." );
    } else {
        isWorkSession = true;
        timeLeft = WORK_DURATION;
        alert("Break's over! Back to work.");
    }
    updateDisplay();
    updateModeDisplay();
    updatePomodoroCountDisplay();
    isRunning = false;
    updateButtons();
}

// Start the timer safely
function startTimer() {
    if (!isRunning) {
        if (timer) clearInterval(timer); // Prevent multiple intervals
        isRunning = true;
        updateButtons();

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                handleSessionEnd();
            }
        }, 1000);
    }
}

// Pause timer
function pauseTimer() {
    if (timer) clearInterval(timer);
    isRunning = false;
    updateButtons();
}

// Reset everything
function resetTimer() {
    if (timer) clearInterval(timer);
    isRunning = false;
    isWorkSession = true;
    timeLeft = WORK_DURATION;
    pomodoroCount = 0;
    updateDisplay();
    updateModeDisplay();
    updatePomodoroCountDisplay();
    updateButtons();
}

// Skip break and return to work
function skipBreak() {
    if (!isWorkSession && confirm("Skip the break and start working?")) {
        if (timer) clearInterval(timer);
        isRunning = false;
        isWorkSession = true;
        timeLeft = WORK_DURATION;
        updateDisplay();
        updateModeDisplay();
        updatePomodoroCountDisplay();
        updateButtons();
    }
}

// Event listeners
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
skipButton.addEventListener("click", skipBreak);

// Initialize UI
updateDisplay();
updateModeDisplay();
updatePomodoroCountDisplay();
updateButtons();