// ===============================
// Select HTML Elements
// ===============================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const completedCount = document.getElementById("completedCount");
const totalCount = document.getElementById("totalCount");
const remainingCount = document.getElementById("remainingCount");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

const clearCompletedBtn =
    document.getElementById("clearCompletedBtn");


// ===============================
// Application State
// ===============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";
let searchText = "";


// ===============================
// Add Task
// ===============================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    // Check for duplicate task
    const duplicateTask = tasks.some(function (task) {
        return task.text.toLowerCase() === taskText.toLowerCase();
    });

    if (duplicateTask) {
        alert("This task already exists.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();
});


// ===============================
// Render Tasks
// ===============================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function (task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });


    filteredTasks = filteredTasks.filter(function (task) {

        return task.text
            .toLowerCase()
            .includes(searchText.toLowerCase());
    });


    filteredTasks.forEach(function (task) {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        // Task Content
        const taskContent = document.createElement("div");
        taskContent.className = "task-content";


        // Complete Button
        const completeButton = document.createElement("button");

        completeButton.className = "complete-btn";
        completeButton.textContent =
            task.completed ? "✓" : "";

        completeButton.addEventListener("click", function () {
            toggleTask(task.id);
        });


        // Task Text
        const taskText = document.createElement("span");

        taskText.className = "task-text";
        taskText.textContent = task.text;


        taskContent.appendChild(completeButton);
        taskContent.appendChild(taskText);


        // Actions
        const taskActions = document.createElement("div");

        taskActions.className = "task-actions";


        // Edit Button
        const editButton = document.createElement("button");

        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            startEditTask(task.id, li);
        });


        // Delete Button
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });


        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);

        li.appendChild(taskContent);
        li.appendChild(taskActions);

        taskList.appendChild(li);
    });


    // Empty State
    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

        if (tasks.length === 0) {

            emptyState.querySelector("h3").textContent =
                "No tasks yet";

            emptyState.querySelector("p").textContent =
                "Add your first task to get started.";

        } else {

            emptyState.querySelector("h3").textContent =
                "No matching tasks";

            emptyState.querySelector("p").textContent =
                "Try changing your search or filter.";
        }

    } else {

        emptyState.style.display = "none";
    }


    updateCounter();
}


// ===============================
// Toggle Complete
// ===============================

function toggleTask(id) {

    const task = tasks.find(function (task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();
    renderTasks();
}


// ===============================
// Delete Task
// ===============================

function deleteTask(id) {

    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}


// ===============================
// Edit Task
// ===============================

function startEditTask(id, taskElement) {

    const task = tasks.find(function (task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }


    taskElement.innerHTML = "";


    const editContainer =
        document.createElement("div");

    editContainer.className = "edit-container";


    const editInput =
        document.createElement("input");

    editInput.className = "edit-input";
    editInput.value = task.text;


    const saveButton =
        document.createElement("button");

    saveButton.className = "save-btn";
    saveButton.textContent = "Save";


    const cancelButton =
        document.createElement("button");

    cancelButton.className = "cancel-btn";
    cancelButton.textContent = "Cancel";


    saveButton.addEventListener("click", function () {

        saveEditedTask(id, editInput.value);
    });


    cancelButton.addEventListener("click", function () {

        renderTasks();
    });


    editInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            saveEditedTask(id, editInput.value);
        }

        if (event.key === "Escape") {
            renderTasks();
        }
    });


    editContainer.appendChild(editInput);
    editContainer.appendChild(saveButton);
    editContainer.appendChild(cancelButton);

    taskElement.appendChild(editContainer);

    editInput.focus();
    editInput.select();
}


// ===============================
// Save Edited Task
// ===============================

function saveEditedTask(id, newText) {

    const cleanText = newText.trim();

    if (cleanText === "") {
        return;
    }


    const duplicateTask = tasks.some(function (task) {

        return (
            task.id !== id &&
            task.text.toLowerCase() ===
            cleanText.toLowerCase()
        );
    });


    if (duplicateTask) {

        alert("This task already exists.");

        return;
    }


    const task = tasks.find(function (task) {
        return task.id === id;
    });


    if (!task) {
        return;
    }


    task.text = cleanText;

    saveTasks();
    renderTasks();
}


// ===============================
// Search
// ===============================

searchInput.addEventListener("input", function () {

    searchText = searchInput.value;

    renderTasks();
});


// ===============================
// Filters
// ===============================

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentFilter = button.dataset.filter;


        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");
        });


        button.classList.add("active");

        renderTasks();
    });
});


// ===============================
// Clear Completed
// ===============================

clearCompletedBtn.addEventListener("click", function () {

    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
});


// ===============================
// LocalStorage
// ===============================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// ===============================
// Counters
// ===============================

function updateCounter() {

    const total = tasks.length;


    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;


    const remaining = total - completed;


    totalCount.textContent = total;

    completedCount.textContent = completed;


    remainingCount.textContent =
        remaining === 1
            ? "1 task remaining"
            : `${remaining} tasks remaining`;


    clearCompletedBtn.disabled =
        completed === 0;
}


// ===============================
// Initial Render
// ===============================

renderTasks();