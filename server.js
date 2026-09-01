const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// MongoDB Connection URI (Local MongoDB / MongoDB Compass)
const MONGO_URI = 'mongodb://127.0.0.1:27017/taskmanager';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Express Server and MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
  });

// 1. POST /tasks - Create a new task (Schema Validation & Default Values)
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /tasks - Retrieve all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. GET /tasks/:id - Retrieve a single task by ID
app.get('/tasks/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. PUT /tasks/:id - Update task by ID (with validation)
app.put('/tasks/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE /tasks/:id - Delete task by ID
app.delete('/tasks/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. 404 Error Handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
