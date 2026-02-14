const User = require("../../models/User");
const Attendance = require("../../models/Attendance");
const Leave = require("../../models/Leave");

/**
 * HR dashboard: employee & manager count
 */
exports.getEmployeeSummary = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const totalManagers = await User.countDocuments({ role: "manager" });

    res.json({
      totalEmployees,
      totalManagers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * HR dashboard: today's attendance
 */
exports.getTodayAttendanceSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const present = await Attendance.countDocuments({
      date: today,
      status: "present",
    });

    const absent = await Attendance.countDocuments({
      date: today,
      status: "absent",
    });

    res.json({ present, absent });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * HR dashboard: pending leaves
 */
exports.getPendingLeaveCount = async (req, res) => {
  try {
    const pendingLeaves = await Leave.countDocuments({
      status: "pending",
    });

    res.json({ pendingLeaves });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
