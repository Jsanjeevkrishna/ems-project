const Task = require("../../models/Task");
const User = require("../../models/User");

/**
 * Manager creates a task for their employee
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, employeeId, dueDate } = req.body;
    const managerId = req.user.id;

    // check employee belongs to manager
    const employee = await User.findOne({
      _id: employeeId,
      role: "employee",
      managerId,
    });

    if (!employee) {
      return res.status(403).json({
        message: "You can assign tasks only to your team members",
      });
    }

    const task = await Task.create({
      title,
      description,
      employeeId,
      managerId,
      dueDate,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      managerId: req.user.id,
    }).populate("employeeId", "name email");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getTeamMembers = async (req, res) => {
  try {
    const managerId = req.user.id;

    const employees = await User.find({
      managerId,
      role: "employee",
    }).select("_id name email");

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};