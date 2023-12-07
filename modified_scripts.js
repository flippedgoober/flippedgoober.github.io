let activePrompt = false;

function editSet(element) {
    if (activePrompt) return;
    activePrompt = true;

    const prompt = document.createElement('div');
    prompt.className = 'prompt';
    prompt.dataset.elementId = element.id; // Store the element's id to use when 'done' is clicked
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

function doneEdit() {
    const prompt = document.querySelector('.prompt');
    const elementId = prompt.dataset.elementId;
    const value = document.getElementById('rep-input').value;

    const element = document.getElementById(elementId);
    element.textContent = value ? `${value} reps` : 'Insert Reps';

    cancelEdit();
}

function addSet(containerId) {
    const container = document.getElementById(containerId);
    const newSet = document.createElement('li');
    newSet.className = 'set';
    const setId = `set-${containerId}-${container.children.length}`;
    newSet.innerHTML = `
        <div class="rep-info" id="${setId}" onclick="editSet(this)">Insert Reps</div>
    `;
    container.insertBefore(newSet, container.children[container.children.length - 1]);
}

// Object mapping exercises to their sets and reps
const exercisesData = {
    "TFL Pulls": { sets: "4 sets", reps: "5-8 reps" },
    "Ring MU": { sets: "3-4 sets", reps: "N/A" },
    "Heat": { sets: "3 sets", reps: "10 reps" },
    "Cold": { sets: "5 sets", reps: "5 reps" },
    // Add more exercises here...
};

function swapExercise(buttonElement) {
    if (activePrompt) return;
    activePrompt = true;

    const exerciseHeader = buttonElement.previousElementSibling;
    const currentExercise = exerciseHeader.textContent.trim();

    // Create the select dropdown and populate with exercises
    const selectElement = document.createElement('select');
    for (const exercise in exercisesData) {
        if (exercise !== currentExercise) {
            const option = document.createElement('option');
            option.value = exercise;
            option.textContent = exercise;
            selectElement.appendChild(option);
        }
    }

    // Create and show the swap prompt
    const prompt = document.createElement('div');
    prompt.className = 'prompt';
    prompt.innerHTML = `<p>Change exercise:</p>`;
    prompt.appendChild(selectElement);
    prompt.innerHTML += `
        <button onclick="cancelSwap()">Cancel</button>
        <button onclick="confirmSwap('${exerciseHeader.id}', selectElement)">Accept</button>
    `;
    document.body.appendChild(prompt);
}

function cancelSwap() {
    const prompt = document.querySelector('.prompt');
    if (prompt) {
        document.body.removeChild(prompt);
        activePrompt = false;
    }
}

function confirmSwap(headerId, selectElement) {
    const selectedExercise = selectElement.value;
    const { sets, reps } = exercisesData[selectedExercise];

    const exerciseHeader = document.getElementById(headerId);
    const instructionsElement = exerciseHeader.nextElementSibling;

    // Update the exercise header and instructions
    exerciseHeader.textContent = selectedExercise;
    instructionsElement.textContent = `${sets} x ${reps}`;

    // Close the prompt and reset activePrompt
    const prompt = document.querySelector('.prompt');
    document.body.removeChild(prompt);
    activePrompt = false;
}
