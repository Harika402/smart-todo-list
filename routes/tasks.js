const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// GET /api/tasks - list tasks, newest first
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch tasks" });
  }
});

// POST /api/tasks - create a task
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Please enter a task title" });
    }
    const task = await Task.create({ title, description, priority, dueDate: dueDate || null });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message || "Could not create task" });
  }
});

// PUT /api/tasks/:id - update task details or completion state
router.put("/:id", async (req, res) => {
  try {
    const allowed = ["title", "description", "priority", "dueDate", "completed"];
    const updates = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) updates[key] = req.body[key];
    }
    if (updates.title !== undefined && !String(updates.title).trim()) {
      return res.status(400).json({ message: "Task title cannot be empty" });
    }
    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message || "Could not update task" });
  }
});

// DELETE /api/tasks/:id - delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid task ID" });
  }
});

module.exports = router;
