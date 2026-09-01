const express = require('express')
const app = express()
const PORT = 3000

// Middleware
app.use(express.json())

// In-memory tasks array
let tasks = [
  { id: 1, title: 'Learn React', completed: false },
  { id: 2, title: 'Build REST API', completed: false },
  { id: 3, title: 'Study Express.js', completed: true }
]

// GET /tasks - Retrieve all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks)
})

// GET /tasks/:id - Retrieve single task
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id))
  if (!task) {
    return res.status(404).json({ message: 'Task not found' })
  }
  res.json(task)
})

// POST /tasks - Create new task
app.post('/tasks', (req, res) => {
  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    title: req.body.title,
    completed: req.body.completed || false
  }
  tasks.push(newTask)
  res.status(201).json(newTask)
})

// PUT /tasks/:id - Update task
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id))
  if (!task) {
    return res.status(404).json({ message: 'Task not found' })
  }
  task.title = req.body.title || task.title
  task.completed = req.body.completed !== undefined ? req.body.completed : task.completed
  res.json(task)
})

// DELETE /tasks/:id - Delete task
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' })
  }
  const deleted = tasks.splice(index, 1)
  res.json({ message: 'Task deleted', task: deleted[0] })
})

// 404 Error Handling - Unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
