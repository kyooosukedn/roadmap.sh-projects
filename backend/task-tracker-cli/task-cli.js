const fs = require('fs');
const { get } = require('http');
const path = require('path');

const getFilePath = () => path.join(__dirname, 'tasks.json'); 

const initializeFile = () => {
    const filePath = getFilePath();
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({tasks: []}, null, 2));
    }
}

const loadTasks = () => {
    initializeFile();
    const filePath = getFilePath();
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data).tasks;
}

const saveTasks = (tasks) => {
    const filePath = getFilePath();
    fs.writeFileSync(filePath, JSON.stringify({tasks}, null, 2));
}

const addTask = (description) => {
    if (!description) {
        throw new Error('Description is required');
    }

    const tasks = loadTasks();
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${newTask.id})`);
}

const updateTask = (id, description) => {
    if (!description) {
        console.log('Error: Task description cannot be empty.');
        return;
    }

    const tasks = loadTasks();
    const task = tasks.find(task => task.id === id);
    if (!task) {
        console.log(`Error: Task with ID ${id} not found.`);
        return;
    }

    task.description = description;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task with ID ${id} updated successfully.`);
};

const deleteTask = (id) => {
    const tasks = loadTasks();
    const newTasks = tasks.filter(task => task.id !== id);

    if (tasks.length === newTasks.length) {
        console.log(`Error: Task with ID ${id} not found.`);
        return;
    }

    saveTasks(newTasks);
    console.log(`Task with ID ${id} deleted successfully.`);
};

const markTaskStatus = (id, status) => {
    const tasks = loadTasks();
    const task = tasks.find(task => task.id === id);
    if (!task) {
        console.log(`Error: Task with ID ${id} not found.`);
        return;
    }

    task.status = status;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task with ID ${id} marked as ${status}.`);
};

const listTasks = (status) => {
    const tasks = loadTasks();
    let filteredTasks;

    if (status) {
        filteredTasks = tasks.filter(task => task.status === status);
    } else {
        filteredTasks = tasks;
    }

    if (filteredTasks.length === 0) {
        console.log('No tasks found.');
    } else {
        filteredTasks.forEach(task => {
            console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, Created At: ${task.createdAt}, Updated At: ${task.updatedAt}`);
        });
    }
};

const main = () => {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'add':
            addTask(args[1]);
            break;
        case 'update':
            updateTask(parseInt(args[1]), args[2]);
            break;
        case 'delete':
            deleteTask(parseInt(args[1]));
            break;
        case 'mark-in-progress':
            markTaskStatus(parseInt(args[1]), 'in-progress');
            break;
        case 'mark-done':
            markTaskStatus(parseInt(args[1]), 'done');
            break;
        case 'list':
            listTasks(args[1]);
            break;
        default:
            console.log('Unknown command');
            console.log('Available commands: add, update, delete, mark-in-progress, mark-done, list');
    }
};

main();
