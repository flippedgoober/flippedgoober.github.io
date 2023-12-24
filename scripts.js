let activePrompt = false;

// Object mapping exercises to their sets and reps
const exercisesData = {
  //Pull Main Exercises
    "TFL Pulls": { sets: "4 Sets", reps: "5-8 Reps", swappableWith: ["Heat"] },
    "Ring MU": { sets: "3-4 Sets", reps: "N/A", swappableWith: ["Cold"] },
    "Bar MU": { sets: "N/A", reps: "20-30 Reps", swappableWith: ["Weighted Pullups"] },
    "1-Arm PU": { sets: "3-4 Sets", reps: "N/A", swappableWith: ["Heat"] },
    "L-Sit High PU": { sets: "3-4 Sets", reps: "N/A", swappableWith: ["High PU"] },
    "Pull Ups": { sets: "3-4 Sets", reps: "N/A", swappableWith: ["Heat"] },
    "Inverted Rows": { sets: "3 Sets", reps: "N/A", swappableWith: ["Heat"] },
    "Scapula Pull Ups": { sets: "3 Sets", reps: "6 Reps", swappableWith: ["Heat"] },
    "Pull Ups": { sets: "3-4 Sets", reps: "N/A", swappableWith: ["Heat"] },
    "Inverted Rows": { sets: "3 sets", reps: "N/A", swappableWith: ["Heat"] },
    "Scapula Pull Ups": { sets: "3 Sets", reps: "N/A", swappableWith: ["Heat"] },
    "Skin the Rat": { sets: "2 Sets", reps: "N/A", swappableWith: ["Heat"] },

    //Pull Swap Exercises
    "Heat": { sets: "3 Sets", reps: "10 Reps", swappableWith: ["TFL Pulls"] },
    "Cold": { sets: "5 Sets", reps: "5 Reps", swappableWith: ["Ring MU"] },
    "Weighted Pullups": { sets: "3 Sets", reps: "N/A", swappableWith: ["Bar MU"] },
    "High PU": { sets: "3-4 Sets", reps: "N/A", swappableWith: ["L-Sit High PU"] },

    //Push Main Exercises
    "HS Hold": { sets: "N/A", reps: "Acquire 2:00 Hold", swappableWith: ["Wall HS"] },
    "HSPU": { sets: "N/A", reps: "20-25 Reps", swappableWith: ["Wall HSPU"] },
    "Wall HSPU": { sets: "3-4 Sets", reps: "N/A", swappableWith: ["Pike Push Ups", "HSPU"] },
    "Iron Cross": { sets: "4-6 Sets", reps: "N/A", swappableWith: ["Archer Push Ups"] },
    "Pseudo-Planche PU": { sets: "4 Sets", reps: "N/A", swappableWith: ["Single Arm Push Ups"] },
    "Planche Leans": { sets: "4 Sets", reps: "N/A", swappableWith: ["Ring Triceps Press"] },
    "Ring Dips": { sets: "3-4 Sets", reps: "N/A", swappableWith: ["Dips", "Straight Bar Dips"] },
    "Push Ups": { sets: "3-4 Sets", reps: "10 Reps", swappableWith: ["Ring Push Ups"] },


    //Push Swap Exercises
    "Wall HS": { sets: "N/A", reps: "Acquire 2:00 Hold", swappableWith: ["HS Hold"] },
    "Pike Push Ups": { sets: "3 Sets", reps: "N/A", swappableWith: ["Wall HSPU"] },
    "Archer Push Ups": { sets: "4-6 Sets", reps: "N/A", swappableWith: ["Iron Cross"] },
    "Single Arm Push Ups": { sets: "4 Sets", reps: "N/A", swappableWith: ["Pseudo-Planche PU"] },
    "Ring Triceps Press": { sets: "4 Sets", reps: "N/A", swappableWith: ["Planche Leans"] },
    "Dips": { sets: "3-4 sets", reps: "N/A", swappableWith: ["Ring Dips","Straight Bar Dips"] },
    "Straight Bar Dips": { sets: "3-4 Sets", reps: "N/A", swappableWith: ["Ring Dips", "Dips"] },
    "Ring Push Ups": { sets: "3-4 Sets", reps: "N/A", swappableWith: ["Push Ups"] },

};

function editSet(element) {
    if (activePrompt) return;
    activePrompt = true;

    const prompt = document.createElement('div');
    prompt.className = 'prompt';
    prompt.dataset.elementId = element.id;
    prompt.innerHTML = `
        <div class="prompt-title">Reps</div> <!-- Title for the prompt -->
        <div class="rep-controls">
            <button onclick="decreaseReps()">-</button>
            <span id="rep-count">10</span> <!-- Default reps number -->
            <button onclick="increaseReps()">+</button>
        </div>
        <button onclick="cancelEdit()">Cancel</button>
        <button onclick="doneEdit()">Done</button>
    `;
    document.body.appendChild(prompt);
}


function increaseReps() {
    const repCount = document.getElementById('rep-count');
    let currentValue = parseInt(repCount.textContent, 10);
    repCount.textContent = currentValue + 1; // Increase the reps
}

function decreaseReps() {
    const repCount = document.getElementById('rep-count');
    let currentValue = parseInt(repCount.textContent, 10);
    if (currentValue > 0) {
        repCount.textContent = currentValue - 1; // Decrease the reps, ensuring it doesn't go below 0
    }
}



function cancelEdit() {
    const prompt = document.querySelector('.prompt');
    if (prompt) {
        document.body.removeChild(prompt);
        activePrompt = false;
    }
}

function cancelSwap() {
    const prompt = document.querySelector('.prompt');
    if (prompt) {
        document.body.removeChild(prompt);
        activePrompt = false;
    }
}

function doneEdit() {
    const prompt = document.querySelector('.prompt');
    const elementId = prompt.dataset.elementId;
    const repCountElement = document.getElementById('rep-count');
    const reps = repCountElement.textContent; // Get the current reps from the span
    const element = document.getElementById(elementId);
    element.textContent = reps + ' reps'; // Update the text content with the new reps
    cancelEdit(); // Close the prompt
    saveWorkoutState(); // Save the state
}


function addSet(containerId) {
    const container = document.getElementById(containerId);
    const newSetIndex = container.children.length - 1;  // Adjust index to accommodate '+ Add Set' button
    const newSet = document.createElement('li');
    newSet.className = 'set';
    const setId = `set-${containerId}-${newSetIndex}`;
    newSet.innerHTML = `
        <div class="rep-info" id="${setId}" onclick="editSet(this)">Insert Reps</div>
    `;
    // Insert the new set before the '+ Add Set' button
    const addButton = container.querySelector('.add-set');
    container.insertBefore(newSet, addButton);
    saveWorkoutState();
}


function swapExercise(buttonElement) {
    if (activePrompt) return;
    activePrompt = true;

    const exerciseHeader = buttonElement.closest('.exercise-header-flex').querySelector('.exercise-header');
    const currentExercise = exerciseHeader.textContent.trim();
    const selectElement = document.createElement('select');
    selectElement.id = `select-${exerciseHeader.id}`;

    exercisesData[currentExercise].swappableWith.forEach((exercise) => {
        const option = document.createElement('option');
        option.value = exercise;
        option.textContent = exercise;
        if (exercise === currentExercise) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });

    const prompt = document.createElement('div');
    prompt.className = 'prompt';
    prompt.innerHTML = '<p>Change exercise:</p>';
    prompt.appendChild(selectElement);
    prompt.innerHTML += `
        <button onclick="cancelSwap()">Cancel</button>
        <button onclick="confirmSwap('${exerciseHeader.id}', '${selectElement.id}')">Accept</button>
    `;
    document.body.appendChild(prompt);
}

function confirmSwap(headerId, selectId) {
    const selectElement = document.getElementById(selectId);
    const selectedExercise = selectElement.options[selectElement.selectedIndex].value;
    const { sets, reps } = exercisesData[selectedExercise];

    const exerciseHeader = document.getElementById(headerId);
    const exerciseContainer = exerciseHeader.closest('.exercise-container');
    const instructionsElement = exerciseContainer.querySelector('.exercise-instructions');

    // Update the exercise header
    exerciseHeader.textContent = selectedExercise;

    // Update the exercise instructions based on sets and reps availability
    let instructionsText = '';
    if (sets !== "N/A") {
        instructionsText += sets;
    }
    if (reps !== "N/A") {
        if (instructionsText.length > 0) instructionsText += ' x ';
        instructionsText += reps;
    }

    instructionsElement.textContent = instructionsText;

    const prompt = document.querySelector('.prompt');
    document.body.removeChild(prompt);
    activePrompt = false;
    saveWorkoutState();
}

function saveWorkoutState() {
    const workoutState = [];
    document.querySelectorAll('.exercise-container').forEach(container => {
        const exerciseHeader = container.querySelector('.exercise-header').textContent.trim();
        const setsReps = container.querySelector('.exercise-instructions').textContent.trim();
        const setsData = Array.from(container.querySelectorAll('.rep-info'))
                                  .filter(repInfo => !repInfo.closest('.add-set'))
                                  .map(repInfo => repInfo.textContent.trim());
        workoutState.push({ exerciseHeader, setsReps, setsData });
    });
    localStorage.setItem('workoutState', JSON.stringify(workoutState));
}




function loadWorkoutState() {
    const savedState = localStorage.getItem('workoutState');
    if (savedState) {
        const workoutState = JSON.parse(savedState);
        workoutState.forEach((exerciseData, index) => {
            const exerciseContainer = document.querySelectorAll('.exercise-container')[index];
            const exerciseHeader = exerciseContainer.querySelector('.exercise-header');
            exerciseHeader.textContent = exerciseData.exerciseHeader;

            const setsRepsElement = exerciseContainer.querySelector('.exercise-instructions');
            setsRepsElement.textContent = exerciseData.setsReps;

            const setsContainer = exerciseContainer.querySelector('.sets-container');
            setsContainer.innerHTML = '';

            exerciseData.setsData.forEach((setData, setIndex) => {
                // Recreate regular sets
                const setElement = document.createElement('li');
                setElement.className = 'set';
                const repInfo = document.createElement('div');
                repInfo.className = 'rep-info';
                repInfo.id = `set-${index + 1}-${setIndex + 1}`;
                repInfo.textContent = setData;
                repInfo.onclick = function() { editSet(this); };
                setElement.appendChild(repInfo);
                setsContainer.appendChild(setElement);
            });

            // Add the '+ Add Set' button here after recreating the sets
            const addButton = document.createElement('li');
            addButton.className = 'set add-set';
            addButton.innerHTML = `<div class="rep-info" onclick="addSet('${setsContainer.id}')">Add Set</div>`;
            setsContainer.appendChild(addButton);
        });
    }
}







function resetWorkout() {
    localStorage.clear();
    window.location.reload(); // Reload the page to reset the state
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadWorkoutState();
});

// Add the reset button functionality
document.getElementById('reset-button').addEventListener('click', resetWorkout);

function removeSet(buttonElement, containerId) {
    const container = document.getElementById(containerId);
    if (container.children.length > 1) {  // Assuming there's always an 'Add Set' button and at least one set
        container.removeChild(container.children[container.children.length - 2]); // Remove the second-last child (last set)
        saveWorkoutState(); // Save the updated state
    }
}

// New global object to track each timer's state
let timersState = {};

function showTimerPrompt(button, timerId) {
    if (activePrompt) return;
    activePrompt = true;

    // Initialize the timer state if not present
    if (!timersState[timerId]) {
        timersState[timerId] = { elapsedSeconds: 0, timerInterval: null };
    }

    const timerState = timersState[timerId];
    const timerDisplay = timerState.elapsedSeconds > 0 ? formatTime(timerState.elapsedSeconds) : "0:00";

    const prompt = document.createElement('div');
    prompt.className = 'prompt timer-prompt';
    prompt.relatedTimerButton = button; // Assign the button to the prompt for reference
    prompt.innerHTML = `
        <div class="timer-display">${timerDisplay}</div>
        <button onclick="startTimer('${timerId}')">Start</button>
        <button onclick="clearTimer('${timerId}')">Clear</button>
        <button onclick="closePrompt()" class="close-prompt">×</button>
    `;
    document.body.appendChild(prompt);
}

var timerInterval;
var elapsedSeconds = 0; // To track elapsed time in seconds
var timerButton; // Reference to the timer button

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function startTimer(timerId) {
    let timerState = timersState[timerId];
    if (timerState.timerInterval) return; // Prevent multiple timers

    // Reset the elapsed seconds to start counting from zero
    timerState.elapsedSeconds = 0;
    const timerButton = document.getElementById(timerId);
    timerButton.style.background = 'none'; // Hide the clock image

    // Immediately update the timer display to "0:00"
    updateTimerDisplay(timerId);

    timerState.timerInterval = setInterval(() => {
        timerState.elapsedSeconds++;
        updateTimerDisplay(timerId);
        if (timerState.elapsedSeconds >= 3600) { // 59:59 limit
            stopTimer(timerId);
        }
    }, 1000);
}


function stopTimer(timerId) {
    let timerState = timersState[timerId];
    if (timerState && timerState.timerInterval) {
        clearInterval(timerState.timerInterval);
        timerState.timerInterval = null;
    }
}

function clearTimer(timerId) {
    let timerState = timersState[timerId];
    if (timerState) {
        stopTimer(timerId);
        timerState.elapsedSeconds = 0;
        updateTimerDisplay(timerId);

        const timerButton = document.getElementById(timerId);
        timerButton.textContent = ''; // Clear the text
        // Reset the background to show the clock image again at the right size
        timerButton.style.background = "url('clock.png') no-repeat center center";
        timerButton.style.backgroundSize = '500%';
    }
}


function updateTimerDisplay(timerId) {
    let timerState = timersState[timerId];
    if (timerState) {
        const timeText = formatTime(timerState.elapsedSeconds);
        const timerButton = document.getElementById(timerId);
        timerButton.textContent = timeText;

        // Check if the prompt display corresponds to this timerId
        const timerDisplay = document.querySelector('.timer-display');
        const prompt = timerDisplay ? timerDisplay.closest('.prompt') : null;
        const activeTimerButton = prompt ? prompt.relatedTimerButton : null;

        // Update the prompt display if it's open and related to this timer
        if (timerDisplay && activeTimerButton === timerButton) {
            timerDisplay.textContent = timeText;
        }
    }
}

function closePrompt() {
    const prompt = document.querySelector('.prompt');
    if (prompt) {
        document.body.removeChild(prompt);
        activePrompt = false;
    }
}
