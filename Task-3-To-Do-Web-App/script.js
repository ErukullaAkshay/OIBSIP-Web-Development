let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];


// Display tasks when page loads

displayTasks();


// Add Task

function addTask() {

    let taskInput =
        document.getElementById("taskInput");

    let dateInput =
        document.getElementById("dateInput");

    let priorityInput =
        document.getElementById("priorityInput");


    let taskText =
        taskInput.value.trim();


    // Check empty task

    if (taskText === "") {

        alert("Please enter a task.");

        return;
    }


    // Create task object

    let task = {

        id: Date.now(),

        title: taskText,

        date: dateInput.value,

        priority: priorityInput.value,

        completed: false

    };


    // Add task to array

    tasks.push(task);


    // Save to LocalStorage

    saveTasks();


    // Clear inputs

    taskInput.value = "";

    dateInput.value = "";

    priorityInput.value = "Low";


    // Display tasks

    displayTasks();

}


// Save tasks

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// Display Tasks

function displayTasks() {

    let taskList =
        document.getElementById("taskList");


    let searchInput =
        document.getElementById("searchInput");


    let filterInput =
        document.getElementById("filterInput");


    let priorityFilter =
        document.getElementById("priorityFilter");


    let searchText =
        searchInput.value.toLowerCase();


    let filter =
        filterInput.value;


    let priority =
        priorityFilter.value;


    // Filter tasks

    let filteredTasks =
        tasks.filter(function(task) {

            let matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchText);


            let matchesStatus = true;


            if (filter === "pending") {

                matchesStatus =
                    task.completed === false;

            }


            if (filter === "completed") {

                matchesStatus =
                    task.completed === true;

            }


            let matchesPriority = true;


            if (priority !== "all") {

                matchesPriority =
                    task.priority === priority;

            }


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );

        });


    // Clear current list

    taskList.innerHTML = "";


    // No tasks

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-message">
                No tasks found.
            </div>
        `;

    }


    // Display each task

    filteredTasks.forEach(function(task) {

        let taskCard =
            document.createElement("div");


        taskCard.className = "task-card";


        if (task.completed) {

            taskCard.classList.add("completed");

        }


        // Date text

        let dateText =
            task.date
                ? "Due: " + formatDate(task.date)
                : "No due date";


        taskCard.innerHTML = `

            <div class="task-info">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-details">

                    <span>
                        ${dateText}
                    </span>

                    <span
                        class="priority ${task.priority}"
                    >
                        ${task.priority}
                    </span>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})"
                >
                    ${task.completed
                        ? "Undo"
                        : "Complete"}
                </button>


                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        `;


        taskList.appendChild(taskCard);

    });


    // Update statistics

    updateStatistics();

}


// Toggle task completion

function toggleTask(id) {

    tasks =
        tasks.map(function(task) {

            if (task.id === id) {

                task.completed =
                    !task.completed;

            }

            return task;

        });


    saveTasks();

    displayTasks();

}


// Edit Task

function editTask(id) {

    let task =
        tasks.find(function(task) {

            return task.id === id;

        });


    if (!task) {

        return;

    }


    let newTitle =
        prompt(
            "Edit your task:",
            task.title
        );


    if (
        newTitle !== null &&
        newTitle.trim() !== ""
    ) {

        task.title =
            newTitle.trim();


        saveTasks();

        displayTasks();

    }

}


// Delete Task

function deleteTask(id) {

    let confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {

        return;

    }


    tasks =
        tasks.filter(function(task) {

            return task.id !== id;

        });


    saveTasks();

    displayTasks();

}


// Clear completed tasks

function clearCompleted() {

    let confirmClear =
        confirm(
            "Remove all completed tasks?"
        );


    if (!confirmClear) {

        return;

    }


    tasks =
        tasks.filter(function(task) {

            return task.completed === false;

        });


    saveTasks();

    displayTasks();

}


// Update Statistics

function updateStatistics() {

    let total =
        tasks.length;


    let completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    let pending =
        total - completed;


    document.getElementById(
        "totalTasks"
    ).textContent = total;


    document.getElementById(
        "pendingTasks"
    ).textContent = pending;


    document.getElementById(
        "completedTasks"
    ).textContent = completed;

}


// Format date

function formatDate(date) {

    let parts =
        date.split("-");


    return (
        parts[2] +
        "-" +
        parts[1] +
        "-" +
        parts[0]
    );

}


// Prevent HTML injection

function escapeHTML(text) {

    let div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}
