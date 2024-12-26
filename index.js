const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

//Middleware
app.use(bodyParser.json());

//Helper functions
const readTasks = () => {
    const data = fs.readFileSync('./tasks.json','utf8');
    return JSON.parse(data);
}

const writeTasks = (tasks) => {
    fs.writeFileSync('./tasks.json',JSON.stringify(tasks,null,2));
}

// Get all tasks
app.get('/tasks',(req,res)=>{
    const tasks = readTasks();
    res.json(tasks);
});

app.get('/',(req,res)=>{
    const tasks = readTasks();
    res.json(tasks);
});

// Get a task by ID
app.get('/tasks/:id',(req,res)=>{
    const tasks = readTasks();
    const task = tasks.find((t)=>t.id === parseInt(req.params.id));
    if(!task){
        return res.status(404).json({message:'Task not found'});
    }
    res.json(task);
});

// Create a new task
app.post('/tasks', (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        title: req.body.title,
        completed: false,
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
});
app.delete('/tasks/:id',(req,res)=>{
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((t)=>t.id === parseInt(req.params.id));
    if(taskIndex === -1){
        return res.status(404).json({message:'Task not found'});
    }
    const deletedTask = tasks.splice(taskIndex,1);
    writeTasks(tasks);
    res.json(deletedTask[0]);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
