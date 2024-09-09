// Function to get current day of the week
function getCurrentDay() {
    const now = new Date();
    return now.toLocaleString('default', { weekday: 'long' }).toLowerCase();
}

// Function to sort tasks by day and importance
function sortTasks(tasks) {
    return tasks.sort((a, b) => {
        const dayA = a.day.toLowerCase();
        const dayB = b.day.toLowerCase();
        
        if (dayA !== dayB) {
            return dayA.localeCompare(dayB); // Sort by day of the week
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

    const currentDay = getCurrentDay().toLowerCase();
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

            // Create a paragraph element for the task name
            const taskParagraph = document.createElement('p');
            
            // Set the innerHTML of the paragraph based on importance
            if (task.isImportant) {
                taskParagraph.innerHTML = `<strong>${task.taskName}</strong><br>${task.description || ''}`;
            } else {
                taskParagraph.innerHTML = `${task.taskName}<br>${task.description || ''}`;
            }
            
            // Add importance styling
            if (task.isImportant) {
                const importantSpan = document.createElement('span');
                importantSpan.className = 'important-task';
                importantSpan.textContent = task.taskName;
                taskParagraph.insertBefore(importantSpan, taskParagraph.firstChild);
            }

            // Add checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `task-${task.taskName.replace(/\s+/g, '-')}`;
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.done || false; // Default to unchecked

            const label = document.createElement('label');
            label.htmlFor = `task-${task.taskName.replace(/\s+/g, '-')}`;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' Done'));

            // Add event listener for checkbox
            checkbox.addEventListener('change', function() {
                task.done = this.checked;
                saveTasksToLocalStorage(tasks);
                displayTasks(tasks);
            });

            // Add strikethrough if task is done
            if (task.done) {
                taskParagraph.style.textDecoration = 'line-through';
            }

            taskItem.appendChild(label);
            taskItem.appendChild(taskParagraph);
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
    return `${month} ${dayOfMonth}`;
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

// Main function to handle form submission
function handleSubmit(e) {
    e.preventDefault();

    const dayOfWeekInput = document.getElementById('dayOfWeek');
    const taskNameInput = document.getElementById('taskName');
    const descriptionInput = document.getElementById('description');
    const isImportantCheckbox = document.getElementById('isImportant');

    const task = {
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

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    todoForm.addEventListener('submit', handleSubmit);

    const clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', handleClearButtonClick);

    const existingTasks = loadTasksFromLocalStorage();
    displayTasks(existingTasks);
});
