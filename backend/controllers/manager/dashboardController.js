const User = require("../../models/User");
const Task = require("../../models/Task");
const Attendance = require("../../models/Attendance");
const mongoose = require("mongoose");

/**
 * Manager dashboard summary
 */
exports.getDashboardSummary = async (req, res) => {
  try {
    const managerId = req.user._id;

    // team size
    const teamSize = await User.countDocuments({
      role: "employee",
      managerId,
    });

    // task summary
    const tasks = await Task.aggregate([
      {
        $match: {
          managerId: new mongoose.Types.ObjectId(managerId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    let totalTasks = 0,
      completedTasks = 0,
      pendingTasks = 0;

    tasks.forEach((t) => {
      totalTasks += t.count;
      if (t._id === "completed") completedTasks = t.count;
      if (t._id === "pending") pendingTasks = t.count;
    });

    // today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const team = await User.find({
      role: "employee",
      managerId,
    }).select("_id");

    const teamIds = team.map((u) => u._id);

    const present = await Attendance.countDocuments({
      userId: { $in: teamIds },
      date: today,
      status: "present",
    });

    res.json({
      teamSize,
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
      },
      attendance: {
        present,
        absent: teamSize - present,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
