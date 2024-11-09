document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("new-task");
    const taskList = document.getElementById("task-list");
    const scoreDisplay = document.getElementById("score");
    const taskStatus = document.getElementById("task-status");
    const loginSection = document.getElementById("login-section");
    const appSection = document.getElementById("app-section");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login-btn");
    const createAccountBtn = document.getElementById("create-account-btn");
    const logoutBtn = document.getElementById("logout-btn");
    let completedTasks = 0;
    let currentUser = null;

    const updateScore = () => {
        scoreDisplay.textContent = `Completed Tasks: ${completedTasks}`;
    };

    const updateTaskStatus = () => {
        if (taskList.children.length === 0) {
            taskStatus.textContent = completedTasks > 0 ? "All tasks completed" : "No tasks set";
        } else {
            taskStatus.textContent = "";
        }
    };

    const saveTasks = () => {
        localStorage.setItem(currentUser, JSON.stringify({
            tasks: taskList.innerHTML,
            completedTasks: completedTasks
        }));
    };

    const loadTasks = () => {
        const savedData = JSON.parse(localStorage.getItem(currentUser));
        if (savedData) {
            taskList.innerHTML = savedData.tasks;
            completedTasks = savedData.completedTasks;
            updateScore();
            updateTaskStatus();
            taskList.querySelectorAll("li").forEach((li, index) => {
                li.addEventListener("click", (e) => {
                    if (e.target.classList.contains("finished")) return;
                    li.classList.toggle("completed");
                    if (li.classList.contains("completed")) {
                        completedTasks++;
                    } else {
                        completedTasks--;
                    }
                    updateScore();
                    saveTasks();
                });
                li.querySelector(".finished").addEventListener("click", () => {
                    if (!li.classList.contains("completed")) {
                        completedTasks++;
                    }
                    taskList.removeChild(li);
                    updateScore();
                    updateTaskStatus();
                    saveTasks();
                });
            });
        }
    };

    const addTask = (event) => {
        event.preventDefault();

        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        const li = document.createElement("li");
        li.textContent = taskText;

        const finishedButton = document.createElement("button");
        finishedButton.textContent = "Finished";
        finishedButton.classList.add("finished");
        finishedButton.addEventListener("click", () => {
            if (!li.classList.contains("completed")) {
                completedTasks++;
            }
            taskList.removeChild(li);
            updateScore();
            updateTaskStatus();
            saveTasks();
        });

        li.addEventListener("click", (e) => {
            if (e.target.classList.contains("finished")) return;
            li.classList.toggle("completed");
            if (li.classList.contains("completed")) {
                completedTasks++;
            } else {
                completedTasks--;
            }
            updateScore();
            saveTasks();
        });

        li.appendChild(finishedButton);
        taskList.appendChild(li);
        taskInput.value = "";
        updateTaskStatus();
        saveTasks();
    };

    const login = () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const savedPassword = localStorage.getItem(username + "_password");

        if (savedPassword && savedPassword === password) {
            currentUser = username;
            loginSection.style.display = "none";
            appSection.style.display = "block";
            loadTasks();
        } else {
            alert("Invalid username or password");
        }
    };

    const createAccount = () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username && password) {
            if (localStorage.getItem(username + "_password")) {
                alert("Username already exists");
            } else {
                localStorage.setItem(username + "_password", password);
                alert("Account created successfully");
                currentUser = username;
                loginSection.style.display = "none";
                appSection.style.display = "block";
                loadTasks();
            }
        } else {
            alert("Please enter a username and password");
        }
    };

    const logout = () => {
        saveTasks();
        currentUser = null;
        loginSection.style.display = "block";
        appSection.style.display = "none";
        usernameInput.value = "";
        passwordInput.value = "";
        taskList.innerHTML = "";
        completedTasks = 0;
        updateScore();
        updateTaskStatus();
    };

    taskForm.addEventListener("submit", addTask);
    loginBtn.addEventListener("click", login);
    createAccountBtn.addEventListener("click", createAccount);
    logoutBtn.addEventListener("click", logout);

    updateTaskStatus();
});
