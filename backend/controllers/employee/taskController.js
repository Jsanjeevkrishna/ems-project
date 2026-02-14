const Task = require("../../models/Task");

/**
 * Get tasks assigned to logged-in employee
 */
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      employeeId: req.user._id,
    })
      .populate("managerId", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update task status (employee only)
 */
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { taskId } = req.params;

    if (!["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findOne({
      _id: taskId,
      employeeId: req.user._id, // security check
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or not authorized",
      });
    }

    task.status = status;
    await task.save();

    res.json({ message: "Task status updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
