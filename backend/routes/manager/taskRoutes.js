const express = require("express");
const {
  createTask,
  getMyTasks,
  getTeamMembers,
} = require("../../controllers/manager/taskController");

const { protect } = require("../../middleware/authMiddleware");
const { isManager } = require("../../middleware/roleMiddleware");

const router = express.Router();

router.post("/create", protect, isManager, createTask);
router.get("/", protect, isManager, getMyTasks);
router.get("/team", protect, isManager, getTeamMembers);

// Update task status (used in ProjectDetail)
router.patch("/:taskId/status", protect, isManager, async (req, res) => {
  try {
    const Task = require("../../models/Task");
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

