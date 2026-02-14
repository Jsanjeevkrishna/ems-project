const Attendance = require("../../models/Attendance");
const Task = require("../../models/Task");

/**
 * Employee dashboard summary (attendance + tasks only)
 */
exports.getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Attendance summary
    const totalDays = await Attendance.countDocuments({ userId });
    const presentDays = await Attendance.countDocuments({
      userId,
      status: "present",
    });

    const attendancePercentage =
      totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);

    // Task summary
    const totalTasks = await Task.countDocuments({ employeeId: userId });
    const completedTasks = await Task.countDocuments({
      employeeId: userId,
      status: "completed",
    });

    res.json({
      attendance: {
        percentage: attendancePercentage,
        presentDays,
        totalDays,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
