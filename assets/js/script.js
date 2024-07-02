// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));


// Todo: create a function to generate a unique task id
function generateTaskId() {
return 'task-' + dayjs().format('YYYYMMDDHHmmssSSS')
};

// Todo: create a function to create a task card
function createTaskCard(task) {
 const card = document.createElement('div');
 card.id = task.id;
 card.classList.add('task-card', 'mb-3', 'p-3');

 const title = document.createElement('h4');
 title.textContent = task.title;
 title.classList.add('card-title', 'mb-3');

 const dueDate = document.createElement('p');
 dueDate.textContent = 'Due Date: ' + task.dueDate;
 dueDate.classList.add('card-text', 'text-muted', 'small');
    
 const description = document.createElement('p');
 description.textContent = task.description;
 description.classList.add('card-text');

 const deleteButton = document.createElement('button');
 deleteButton.textContent = 'Delete';
 deleteButton.classList.add('btn', 'btn-danger', 'delete-button', 'mt-3');
 deleteButton.addEventListener('click', () => handleDeleteTask(task.id));
 card.append(title);
 card.append(dueDate);
 card.append(description);
 card.append(deleteButton);
 return card;
};

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const todoContainer = document.getElementById('todo-cards');
    const inProgressContainer = document.getElementById('in-progress-cards');
    const doneContainer = document.getElementById('done-cards');

    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        if (task.status === 'todo') {
            todoContainer.appendChild(taskCard);
        } else if (task.status === 'in-progress') {
            inProgressContainer.appendChild(taskCard);
        } else if (task.status === 'done') {
            doneContainer.appendChild(taskCard);
        }
        $(taskCard).draggable({
            revert: true,
            revertDuration: 0,
            zIndex: 1000
        });
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const taskTitle = document.getElementById('taskTitle').value;
    const taskDueDate = document.getElementById('taskDueDate').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskId = generateTaskId();
    const newTask= {
        id: taskId,
        title: taskTitle,
        dueDate: taskDueDate,
        description: taskDescription,
        status: 'todo'
    };
    
    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList))
    const taskCard = createTaskCard(newTask);
    document.getElementById('todo-cards').appendChild(taskCard);
    $(taskCard).draggable({
        revert: true,
        revertDuration: 0,
        zIndex: 1000
    });
    document.getElementById('taskForm').reset();
};

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId) {
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    const taskCard = document.getElementById(taskId);
    taskCard.remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr('id');
    const newStatus = event.target.id;
    const updatedTask = taskList.find(task => task.id === taskId);
    updatedTask.status = newStatus;
    ui.draggable.remove();
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
    
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $('.task-card').draggable({
        revert: true,
        revertDuration: 0,
        zIndex: 1000
    });
    $('#todo, #in-progress, #done').droppable({
        drop: handleDrop
    });
    document.getElementById('taskForm').addEventListener('submit', handleAddTask);
    $('#taskDueDate').datepicker();
});