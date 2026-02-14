const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  getMyTasks,
  updateTaskStatus,
} = require("../../controllers/employee/taskController");

const router = express.Router();

// GET /api/employee/tasks
router.get("/", protect, getMyTasks);

// PATCH /api/employee/tasks/:taskId
router.patch("/:taskId", protect, updateTaskStatus);

module.exports = router;
