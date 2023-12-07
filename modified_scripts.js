let activePrompt = false;

// Object mapping exercises to their sets and reps
const exercisesData = {
  //Main Exercises
    "TFL Pulls": { sets: "4 sets", reps: "5-8 reps", swappableWith: ["Heat"] },
    "Ring MU": { sets: "3-4 sets", reps: "N/A", swappableWith: ["Cold"] },
    "Bar MU": { sets: "N/A", reps: "20-30 reps", swappableWith: ["Weighted Pullups"] },
    "1-Arm PU": { sets: "3-4 sets", reps: "N/A", swappableWith: ["Heat"] },
    "L-Sit High PU": { sets: "3-4 sets", reps: "N/A", swappableWith: ["High PU"] },
    "Pull Ups": { sets: "3-4 sets", reps: "N/A", swappableWith: ["Heat"] },
    "Inverted Rows": { sets: "3 sets", reps: "N/A", swappableWith: ["Heat"] },
    "Scapula Pull Ups": { sets: "3 sets", reps: "6 reps", swappableWith: ["Heat"] },
    "Pull Ups": { sets: "3-4 sets", reps: "N/A", swappableWith: ["Heat"] },
    "Inverted Rows": { sets: "3 sets", reps: "N/A", swappableWith: ["Heat"] },
    "Scapula Pull Ups": { sets: "3 sets", reps: "N/A", swappableWith: ["Heat"] },
    "Skin the Rat": { sets: "2 sets", reps: "N/A", swappableWith: ["Heat"] },




    //Swap Exercises
    "Heat": { sets: "3 sets", reps: "10 reps", swappableWith: ["TFL Pulls"] },
    "Cold": { sets: "5 sets", reps: "5 reps", swappableWith: ["Ring MU"] },
    "Weighted Pullups": { sets: "3 sets", reps: "N/A", swappableWith: ["Bar MU"] },
    "High PU": { sets: "3-4 sets", reps: "N/A", swappableWith: ["L-Sit High PU"] },



};

function editSet(element) {
    if (activePrompt) return;
    activePrompt = true;

    const prompt = document.createElement('div');
    prompt.className = 'prompt';
    prompt.dataset.elementId = element.id;
    prompt.innerHTML = `
        <input type="number" id="rep-input" placeholder="Enter reps" autofocus />
        <button onclick="cancelEdit()">Cancel</button>
        <button onclick="doneEdit()">Done</button>
    `;
    document.body.appendChild(prompt);
    document.getElementById('rep-input').focus();
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
    const value = document.getElementById('rep-input').value;
    const element = document.getElementById(elementId);
    element.textContent = value ? `${value} reps` : 'Insert Reps';
    cancelEdit();
    saveWorkoutState();
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
        const setsData = Array.from(container.querySelectorAll('.rep-info')).map(set => set.textContent.trim());
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
                if (setData !== '+ Add Set') {
                    const setElement = document.createElement('li');
                    setElement.className = 'set';
                    const repInfo = document.createElement('div');
                    repInfo.className = 'rep-info';
                    repInfo.id = `set-${index + 1}-${setIndex + 1}`;
                    repInfo.textContent = setData;
                    repInfo.onclick = function() { editSet(this); };
                    setElement.appendChild(repInfo);
                    setsContainer.appendChild(setElement);
                }
            });

            // Recreate the '+ Add Set' button as the last element
            const addButtonLi = document.createElement('li');
            addButtonLi.className = 'set add-set';
            const addButtonDiv = document.createElement('div');
            addButtonDiv.className = 'rep-info';
            addButtonDiv.textContent = '+ Add Set';
            addButtonDiv.onclick = function() { addSet(setsContainer.id); };
            addButtonLi.appendChild(addButtonDiv);
            setsContainer.appendChild(addButtonLi);
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
