document.addEventListener('DOMContentLoaded', function () {
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeModalSpan = document.querySelector('.close');
    const saveTaskBtn = document.getElementById('save-task-btn');

    const taskIdInput = document.getElementById('task-id');
    const taskNameInput = document.getElementById('task-name');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskAssigneeInput = document.getElementById('task-assignee');
    const taskStatusSelect = document.getElementById('task-status');

    const taskLists = document.querySelectorAll('.task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // タスクの描画
    function renderTasks() {
        taskLists.forEach(taskList => {
            taskList.innerHTML = ''; // Clear existing tasks
            const status = taskList.closest('.column').dataset.status;
            const filteredTasks = tasks.filter(task => task.status === status);

            filteredTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task');
                taskElement.draggable = true;
                taskElement.dataset.id = task.id;
                taskElement.innerHTML = `
                    <h3>${task.name}</h3>
                    <p>${task.description}</p>
                    <p>担当者: ${task.assignee}</p>
                `;

                taskElement.addEventListener('dragstart', dragStart);
                taskElement.addEventListener('click', () => openEditModal(task.id)); // タスククリックで編集
                taskList.appendChild(taskElement);
            });
        });
    }

    // タスク追加ボタンクリック
    addTaskBtn.addEventListener('click', () => {
        taskModal.style.display = 'flex';
        document.querySelector('#task-modal h2').textContent = 'タスクの追加';
        taskIdInput.value = ''; // Clear task ID for new task
        taskNameInput.value = '';
        taskDescriptionInput.value = '';
        taskAssigneeInput.value = '';
        taskStatusSelect.value = 'todo';
    });

    // モーダル閉じる
    closeModalSpan.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });

    // タスク保存
    saveTaskBtn.addEventListener('click', () => {
        const taskId = taskIdInput.value;
        const taskName = taskNameInput.value.trim();
        const taskDescription = taskDescriptionInput.value.trim();
        const taskAssignee = taskAssigneeInput.value.trim();
        const taskStatus = taskStatusSelect.value;

        if (taskName) {
            if (taskId) {
                // Update existing task
                tasks = tasks.map(task => {
                    if (task.id == taskId) {
                        task.name = taskName;
                        task.description = taskDescription;
                        task.assignee = taskAssignee;
                        task.status = taskStatus;
                    }
                    return task;
                });
            } else {
                // Create new task
                const task = {
                    id: Date.now(),
                    name: taskName,
                    description: taskDescription,
                    assignee: taskAssignee,
                    status: taskStatus
                };
                tasks.push(task);
            }

            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            taskModal.style.display = 'none'; // モーダルを閉じる
        }
    });

    // タスク編集のためにモーダルを開く
    function openEditModal(taskId) {
        const task = tasks.find(task => task.id == taskId);
        if (task) {
            taskModal.style.display = 'flex';
            document.querySelector('#task-modal h2').textContent = 'タスクの編集';
            taskIdInput.value = task.id;
            taskNameInput.value = task.name;
            taskDescriptionInput.value = task.description;
            taskAssigneeInput.value = task.assignee;
            taskStatusSelect.value = task.status;
        }
    }

    // Drag & Drop
    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.id);
    }

    taskLists.forEach(taskList => {
        taskList.addEventListener('dragover', dragOver);
        taskList.addEventListener('drop', drop);
    });

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const taskId = event.dataTransfer.getData('text/plain');
        const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);
        const newStatus = event.target.closest('.column').dataset.status;

        if (taskElement && newStatus) {
            tasks = tasks.map(task => {
                if (task.id == taskId) {
                    task.status = newStatus;
                }
                return task;
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    }

    renderTasks(); // 初期描画
});