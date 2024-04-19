const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Update Task Status
router.post('/tasks/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!task) {
      console.log(`Task with ID ${req.params.id} not found.`);
      return res.status(404).send('Task not found');
    }
    console.log(`Task status updated: ${task}`);
    res.status(200).json(task);
  } catch (error) {
    console.error(`Error updating task status: ${error.message}`, error);
    res.status(500).send(error.message);
  }
});

// Get Progress of all Tasks
router.get('/tasks/progress', async (req, res) => {
  try {
    const tasks = await Task.find({});
    console.log(`Retrieved all tasks progress.`);
    res.status(200).json(tasks);
  } catch (error) {
    console.error(`Error retrieving tasks progress: ${error.message}`, error);
    res.status(500).send(error.message);
  }
});

module.exports = router;