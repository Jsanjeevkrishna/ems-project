const Attendance = require("../../models/Attendance");
const User = require("../../models/User");

/**
 * Employee / Manager marks attendance
 */
exports.markAttendance = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      { userId, date: today },
      { status },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Attendance marked",
      attendance,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * HR Summary (Present / Absent count)
 */
exports.getTodaySummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalUsers = await User.countDocuments({
      role: { $in: ["employee", "manager"] },
    });

    const presentCount = await Attendance.countDocuments({
      date: today,
      status: "present",
    });

    res.json({
      totalUsers,
      present: presentCount,
      absent: totalUsers - presentCount,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * HR Attendance List (Show ALL users, even absent)
 */
exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all employees + managers
    const users = await User.find({
      role: { $in: ["employee", "manager"] },
    }).select("name role");

    // Get today's attendance records
    const records = await Attendance.find({ date: today });

    // Create map of userId -> status
    const attendanceMap = {};
    records.forEach((record) => {
      attendanceMap[record.userId.toString()] = record.status;
    });

    // Combine users + attendance
    const result = users.map((user) => ({
      _id: user._id,
      name: user.name,
      role: user.role,
      status: attendanceMap[user._id.toString()] || "absent",
    }));

    res.json(result);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
