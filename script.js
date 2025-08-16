document.addEventListener('DOMContentLoaded', function () {
    const taskNameInput = document.getElementById('new-task-name');
    const taskAssigneeInput = document.getElementById('new-task-assignee');
    const taskStatusSelect = document.getElementById('new-task-status');
    const addTaskButton = document.getElementById('add-task-button');

    const todoList = document.getElementById('todo-list');
    const doingList = document.getElementById('doing-list');
    const doneList = document.getElementById('done-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks() {
        todoList.innerHTML = '';
        doingList.innerHTML = '';
        doneList.innerHTML = '';

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.setAttribute('draggable', true);
            taskElement.dataset.id = task.id;

            taskElement.addEventListener('dragstart', dragStart);

            const taskNameElement = document.createElement('h3');
            taskNameElement.textContent = task.name;
            taskElement.appendChild(taskNameElement);

            const taskAssigneeElement = document.createElement('p');
            taskAssigneeElement.textContent = `担当者: ${task.assignee}`;
            taskElement.appendChild(taskAssigneeElement);

            if (task.status === 'todo') {
                todoList.appendChild(taskElement);
            } else if (task.status === 'doing') {
                doingList.appendChild(taskElement);
            } else {
                doneList.appendChild(taskElement);
            }
        });
    }

    function addTask() {
        const taskName = taskNameInput.value.trim();
        const taskAssignee = taskAssigneeInput.value.trim();
        const taskStatus = taskStatusSelect.value;

        if (taskName !== '') {
            const task = {
                id: Date.now(),
                name: taskName,
                assignee: taskAssignee,
                status: taskStatus
            };

            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();

            taskNameInput.value = '';
            taskAssigneeInput.value = '';
        }
    }

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.id);
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const taskId = event.dataTransfer.getData('text/plain');
        const taskElement = document.querySelector(`[data-id="${taskId}"]`);
        const newStatus = event.target.closest('.task-list').dataset.status;

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

    addTaskButton.addEventListener('click', addTask);

    const taskLists = document.querySelectorAll('.task-list');
    taskLists.forEach(taskList => {
        taskList.addEventListener('dragover', allowDrop);
        taskList.addEventListener('drop', drop);
    });

    renderTasks();
});