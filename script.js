document.addEventListener('DOMContentLoaded', function () {
    const taskNameInput = document.getElementById('new-task-name');
    const taskProgressSelect = document.getElementById('new-task-progress');
    const taskAssigneeInput = document.getElementById('new-task-assignee');
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
            taskElement.draggable = true;
            taskElement.dataset.id = task.id;

            taskElement.addEventListener('dragstart', dragStart);

            const taskName = document.createElement('p');
            taskName.textContent = `タスク名: ${task.name}`;
            taskElement.appendChild(taskName);

            const taskAssignee = document.createElement('p');
            taskAssignee.textContent = `担当者: ${task.assignee}`;
            taskElement.appendChild(taskAssignee);

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
        const taskProgress = taskProgressSelect.value;
        const taskAssignee = taskAssigneeInput.value.trim();

        if (taskName !== '') {
            const task = {
                id: Date.now(),
                name: taskName,
                status: taskProgress,
                assignee: taskAssignee
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
        const newStatus = event.target.dataset.status;

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

    todoList.addEventListener('dragover', allowDrop);
    todoList.addEventListener('drop', drop);

    doingList.addEventListener('dragover', allowDrop);
    doingList.addEventListener('drop', drop);

    doneList.addEventListener('dragover', allowDrop);
    doneList.addEventListener('drop', drop);

    renderTasks();
});