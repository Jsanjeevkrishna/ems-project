const Attendance = require("../../models/Attendance");

/**
 * Mark today's attendance
 */
exports.markAttendance = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      userId,
      date: today,
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already marked for today",
      });
    }

    await Attendance.create({
      userId,
      date: today,
      status: "present",
    });

    res.status(201).json({
      message: "Attendance marked successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get own attendance summary
 */
exports.getMyAttendanceSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalDays = await Attendance.countDocuments({ userId });
    const presentDays = await Attendance.countDocuments({
      userId,
      status: "present",
    });

    const percentage =
      totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);

    res.json({
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      percentage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get own attendance history
 */
exports.getMyAttendanceHistory = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      userId: req.user._id,
    }).sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
