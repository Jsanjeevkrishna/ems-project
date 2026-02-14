const Attendance = require("../../models/Attendance");
const User = require("../../models/User");

/**
 * Manager views attendance of own team
 */
exports.getTeamAttendance = async (req, res) => {
  try {
    const managerId = req.user.id;

    // get employees under this manager
    const employees = await User.find({
      managerId,
      role: "employee",
    }).select("_id name email");

    const employeeIds = employees.map((e) => e._id);

    // get attendance of team
    const attendance = await Attendance.find({
      userId: { $in: employeeIds },
    })
      .populate("userId", "name email")
      .sort({ date: -1 });

    res.json({
      teamSize: employees.length,
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Manager views today's team attendance summary
 */
exports.getTodayTeamAttendanceSummary = async (req, res) => {
  try {
    const managerId = req.user.id;

    const employees = await User.find({
      managerId,
      role: "employee",
    });

    const employeeIds = employees.map((e) => e._id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const presentCount = await Attendance.countDocuments({
      userId: { $in: employeeIds },
      date: today,
      status: "present",
    });

    res.json({
      totalEmployees: employees.length,
      present: presentCount,
      absent: employees.length - presentCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
