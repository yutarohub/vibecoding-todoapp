document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('new-task-input');
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
            taskElement.textContent = task.text;
            taskElement.draggable = true;
            taskElement.dataset.id = task.id;

            taskElement.addEventListener('dragstart', dragStart);

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
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const task = {
                id: Date.now(),
                text: taskText,
                status: 'todo'
            };
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            taskInput.value = '';
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