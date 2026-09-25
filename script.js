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

const taskMessage =
    document.getElementById("taskMessage");


// ===============================
// Application State
// ===============================

let tasks = loadTasks();

let currentFilter = "all";
let searchText = "";


// ===============================
// Messages
// ===============================

function showMessage(message, type = "error") {

    taskMessage.textContent = message;

    taskMessage.className =
        `task-message ${type}`;

    setTimeout(function () {

        taskMessage.textContent = "";

        taskMessage.className =
            "task-message";

    }, 3000);
}


// ===============================
// Add Task
// ===============================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText =
        taskInput.value.trim();


    // Prevent empty task
    if (taskText === "") {

        showMessage(
            "Please enter a task."
        );

        return;
    }


    // Check for duplicate task
    const duplicateTask =
        tasks.some(function (task) {

            return (
                task.text.toLowerCase() ===
                taskText.toLowerCase()
            );
        });


    if (duplicateTask) {

        showMessage(
            "This task already exists."
        );

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


    // Filter by status
    let filteredTasks =
        tasks.filter(function (task) {

            if (
                currentFilter === "active"
            ) {

                return !task.completed;
            }


            if (
                currentFilter === "completed"
            ) {

                return task.completed;
            }


            return true;
        });


    // Filter by search
    filteredTasks =
        filteredTasks.filter(function (task) {

            return task.text
                .toLowerCase()
                .includes(
                    searchText.toLowerCase()
                );
        });


    // Create task elements
    filteredTasks.forEach(function (task) {

        const li =
            document.createElement("li");

        li.className = "task-item";


        if (task.completed) {

            li.classList.add(
                "completed"
            );
        }


        // ===============================
        // Task Content
        // ===============================

        const taskContent =
            document.createElement("div");

        taskContent.className =
            "task-content";


        // Complete Button

        const completeButton =
            document.createElement("button");

        completeButton.className =
            "complete-btn";

        completeButton.textContent =
            task.completed ? "✓" : "";


        // Accessibility
        completeButton.setAttribute(
            "aria-label",
            task.completed
                ? `Mark "${task.text}" as active`
                : `Mark "${task.text}" as completed`
        );


        completeButton.addEventListener(
            "click",
            function () {

                toggleTask(task.id);
            }
        );


        // Task Text

        const taskText =
            document.createElement("span");

        taskText.className =
            "task-text";

        taskText.textContent =
            task.text;


        taskContent.appendChild(
            completeButton
        );

        taskContent.appendChild(
            taskText
        );


        // ===============================
        // Task Actions
        // ===============================

        const taskActions =
            document.createElement("div");

        taskActions.className =
            "task-actions";


        // Edit Button

        const editButton =
            document.createElement("button");

        editButton.className =
            "edit-btn";

        editButton.textContent =
            "Edit";


        editButton.setAttribute(
            "aria-label",
            `Edit task: ${task.text}`
        );


        editButton.addEventListener(
            "click",
            function () {

                startEditTask(
                    task.id,
                    li
                );
            }
        );


        // Delete Button

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-btn";

        deleteButton.textContent =
            "Delete";


        deleteButton.setAttribute(
            "aria-label",
            `Delete task: ${task.text}`
        );


        deleteButton.addEventListener(
            "click",
            function () {

                deleteTask(task.id);
            }
        );


        taskActions.appendChild(
            editButton
        );

        taskActions.appendChild(
            deleteButton
        );


        li.appendChild(
            taskContent
        );

        li.appendChild(
            taskActions
        );


        taskList.appendChild(li);
    });


    // ===============================
    // Empty State
    // ===============================

    if (filteredTasks.length === 0) {

        emptyState.style.display =
            "block";


        if (tasks.length === 0) {

            emptyState
                .querySelector("h3")
                .textContent =
                "No tasks yet";


            emptyState
                .querySelector("p")
                .textContent =
                "Add your first task to get started.";

        } else {

            emptyState
                .querySelector("h3")
                .textContent =
                "No matching tasks";


            emptyState
                .querySelector("p")
                .textContent =
                "Try changing your search or filter.";
        }

    } else {

        emptyState.style.display =
            "none";
    }


    updateCounter();
}


// ===============================
// Toggle Complete
// ===============================

function toggleTask(id) {

    const task =
        tasks.find(function (task) {

            return task.id === id;
        });


    if (!task) {

        return;
    }


    task.completed =
        !task.completed;


    saveTasks();

    renderTasks();
}


// ===============================
// Delete Task
// ===============================

function deleteTask(id) {

    tasks =
        tasks.filter(function (task) {

            return task.id !== id;
        });


    saveTasks();

    renderTasks();
}


// ===============================
// Edit Task
// ===============================

function startEditTask(
    id,
    taskElement
) {

    const task =
        tasks.find(function (task) {

            return task.id === id;
        });


    if (!task) {

        return;
    }


    taskElement.innerHTML = "";


    const editContainer =
        document.createElement("div");

    editContainer.className =
        "edit-container";


    const editInput =
        document.createElement("input");

    editInput.className =
        "edit-input";

    editInput.value =
        task.text;


    // Accessibility
    editInput.setAttribute(
        "aria-label",
        `Edit task: ${task.text}`
    );


    const saveButton =
        document.createElement("button");

    saveButton.className =
        "save-btn";

    saveButton.textContent =
        "Save";


    const cancelButton =
        document.createElement("button");

    cancelButton.className =
        "cancel-btn";

    cancelButton.textContent =
        "Cancel";


    saveButton.addEventListener(
        "click",
        function () {

            saveEditedTask(
                id,
                editInput.value
            );
        }
    );


    cancelButton.addEventListener(
        "click",
        function () {

            renderTasks();
        }
    );


    editInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                saveEditedTask(
                    id,
                    editInput.value
                );
            }


            if (event.key === "Escape") {

                renderTasks();
            }
        }
    );


    editContainer.appendChild(
        editInput
    );

    editContainer.appendChild(
        saveButton
    );

    editContainer.appendChild(
        cancelButton
    );


    taskElement.appendChild(
        editContainer
    );


    editInput.focus();

    editInput.select();
}


// ===============================
// Save Edited Task
// ===============================

function saveEditedTask(
    id,
    newText
) {

    const cleanText =
        newText.trim();


    // Prevent empty task
    if (cleanText === "") {

        showMessage(
            "Task cannot be empty."
        );

        return;
    }


    // Check for duplicate task
    const duplicateTask =
        tasks.some(function (task) {

            return (
                task.id !== id &&
                task.text.toLowerCase() ===
                cleanText.toLowerCase()
            );
        });


    if (duplicateTask) {

        showMessage(
            "This task already exists."
        );

        return;
    }


    const task =
        tasks.find(function (task) {

            return task.id === id;
        });


    if (!task) {

        return;
    }


    task.text =
        cleanText;


    saveTasks();

    renderTasks();
}


// ===============================
// Search
// ===============================

searchInput.addEventListener(
    "input",
    function () {

        searchText =
            searchInput.value;

        renderTasks();
    }
);


// ===============================
// Filters
// ===============================

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                renderTasks();
            }
        );
    }
);


// ===============================
// Clear Completed
// ===============================

clearCompletedBtn.addEventListener(
    "click",
    function () {

        tasks =
            tasks.filter(function (task) {

                return !task.completed;
            });


        saveTasks();

        renderTasks();
    }
);


// ===============================
// Load Tasks
// ===============================

function loadTasks() {

    try {

        const savedTasks =
            localStorage.getItem(
                "tasks"
            );


        if (!savedTasks) {

            return [];
        }


        const parsedTasks =
            JSON.parse(savedTasks);


        return Array.isArray(
            parsedTasks
        )
            ? parsedTasks
            : [];

    } catch (error) {

        console.error(
            "Failed to load tasks:",
            error
        );


        return [];
    }
}


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

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed;
            }
        ).length;


    const remaining =
        total - completed;


    totalCount.textContent =
        total;

    completedCount.textContent =
        completed;


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