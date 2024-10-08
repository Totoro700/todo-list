// Function to get current day of the week
function getCurrentDay() {
    const now = new Date();
    return now.toLocaleString('default', { weekday: 'long' }).toLowerCase();
}

// Function to sort tasks by day and importance
function sortTasks(tasks) {
    return tasks.sort((a, b) => {
        const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayIndexA = daysOfWeek.indexOf(a.day.toLowerCase());
        const dayIndexB = daysOfWeek.indexOf(b.day.toLowerCase());

        if (dayIndexA !== dayIndexB) {
            return dayIndexA - dayIndexB; // Sort by day of the week
        } else {
            // First, sort by importance (important tasks first)
            if (a.isImportant && !b.isImportant) return -1;
            if (!a.isImportant && b.isImportant) return 1;
            
            // Then, sort by task name (alphabetically)
            return a.taskName.localeCompare(b.taskName);
        }
    });
}

// Function to display tasks
function displayTasks(tasks) {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';

    const sortedTasks = sortTasks(tasks);
    let formattedTasks = {};

    sortedTasks.forEach(task => {
        if (!formattedTasks[task.day]) {
            formattedTasks[task.day] = [];
        }
        formattedTasks[task.day].push(task);
    });

    Object.keys(formattedTasks).forEach(day => {
        const dayTasks = formattedTasks[day];
        const dayHeader = document.createElement('h3');
        dayHeader.textContent = `${day.charAt(0).toUpperCase() + day.slice(1)} (${formatDate(day)}):`;
        tasksList.appendChild(dayHeader);

        dayTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';

            // Create a separate span for the task name
            const taskNameSpan = document.createElement('span');
            taskNameSpan.className = 'task-name';
            taskNameSpan.textContent = task.taskName;

            // Conditionally add importance class
            if (task.isImportant) {
                taskNameSpan.classList.add('important-task');
            }

            // Add other task details
            const taskDetails = document.createElement('div');
            taskDetails.textContent = task.description || '';

            // Create a button to mark task as done
            const doneButton = document.createElement('button');
            doneButton.textContent = 'Done';
            doneButton.onclick = () => handleTaskCompletion(task.id);

            // Combine task name, details, and done button
            taskItem.appendChild(taskNameSpan);
            taskItem.appendChild(document.createTextNode(' '));
            taskItem.appendChild(doneButton);
            taskItem.appendChild(taskDetails);

            tasksList.appendChild(taskItem);
        });
    });
}

// Helper function to format date for a specific day
function formatDate(day) {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    targetDate.setDate(targetDate.getDate() + ((day === 'sunday') ? 6 : day.charCodeAt(0) - 97)); // Adjust for Sunday being 0
    const month = targetDate.toLocaleString('default', { month: 'short' });
    const dayOfMonth = targetDate.getDate();
    return `${month}${dayOfMonth}`;
}

// Function to save tasks to localStorage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}

// Function to clear tasks from localStorage
function clearTasksFromLocalStorage() {
    localStorage.removeItem('tasks');
    displayTasks([]); // Display empty list
}

// Function to handle form submission
function handleSubmit(e) {
    e.preventDefault();

    const dayOfWeekInput = document.getElementById('dayOfWeek');
    const taskNameInput = document.getElementById('taskName');
    const descriptionInput = document.getElementById('description');
    const isImportantCheckbox = document.getElementById('isImportant');

    const task = {
        id: Date.now(), // Unique identifier for each task
        day: dayOfWeekInput.value,
        taskName: taskNameInput.value,
        description: descriptionInput.value,
        isImportant: isImportantCheckbox.checked,
        done: false // New property for tracking completion
    };

    const existingTasks = loadTasksFromLocalStorage();
    existingTasks.push(task);
    saveTasksToLocalStorage(existingTasks);

    displayTasks(existingTasks);
    dayOfWeekInput.value = ''; // Clear input fields after submission
    taskNameInput.value = '';
    descriptionInput.value = '';
    isImportantCheckbox.checked = false;

    console.log('Task added successfully!');
}

// Function to handle clear button click
function handleClearButtonClick() {
    clearTasksFromLocalStorage();
    console.log('Todo list cleared!');
}

// Function to handle task completion
function handleTaskCompletion(taskId) {
    const tasks = loadTasksFromLocalStorage();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage(updatedTasks);
    displayTasks(updatedTasks);
    console.log(`Task with ID ${taskId} removed from the list.`);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    todoForm.addEventListener('submit', handleSubmit);

    const clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', handleClearButtonClick);

    const existingTasks = loadTasksFromLocalStorage();
    displayTasks(existingTasks);
});
