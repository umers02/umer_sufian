let tasks = [];
let currentId = 1;

const getAllTasks = (req, res) => {
  const { title } = req.query;
  
  let filteredTasks = tasks;
  if (title) {
    filteredTasks = tasks.filter(task => 
      task.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  
  res.json(filteredTasks);
};

const getTaskById = (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

const createTask = (req, res) => {
  const newTask = {
    id: currentId++,
    title: req.body.title || "Untitled Task",
    completed: req.body.completed ?? false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
};

const updateTask = (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: "Task not found" });
  
  task.title = req.body.title ?? task.title;
  task.completed = req.body.completed ?? task.completed;
  
  res.json(task);
};

const deleteTask = (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (taskIndex === -1) return res.status(404).json({ message: "Task not found" });

  const deleted = tasks.splice(taskIndex, 1);
  res.json({ message: "Task deleted", deleted });
};

const getStats = (req, res) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  
  res.json({ total, completed, pending });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getStats
};