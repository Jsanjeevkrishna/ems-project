const Task = require("../../models/Task");
const User = require("../../models/User");
const mongoose = require("mongoose");

/**
 * 1️⃣ Manager views TEAM performance
 */
exports.getTeamPerformance = async (req, res) => {
  try {
    const managerId = req.user.id;

    const employees = await User.find({
      role: "employee",
      managerId,
    }).select("_id name email");

    const employeeIds = employees.map((e) => e._id);

    const stats = await Task.aggregate([
      {
        $match: {
          managerId: new mongoose.Types.ObjectId(managerId),
          employeeId: { $in: employeeIds },
        },
      },
      {
        $group: {
          _id: "$employeeId",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
        },
      },
      {
        $addFields: {
          completionPercentage: {
            $cond: [
              { $eq: ["$totalTasks", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$completedTasks", "$totalTasks"] },
                      100,
                    ],
                  },
                  0,
                ],
              },
            ],
          },
        },
      },
    ]);

    const result = employees.map((emp) => {
      const perf = stats.find(
        (s) => s._id.toString() === emp._id.toString()
      );

      return {
        employeeId: emp._id,
        name: emp.name,
        email: emp.email,
        totalTasks: perf?.totalTasks || 0,
        completedTasks: perf?.completedTasks || 0,
        completionPercentage: perf?.completionPercentage || 0,
      };
    });

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * 2️⃣ Manager views INDIVIDUAL employee performance
 */
exports.getEmployeePerformance = async (req, res) => {
  try {
    const managerId = req.user.id;
    const { employeeId } = req.params;

    const employee = await User.findOne({
      _id: employeeId,
      role: "employee",
      managerId,
    }).select("name email");

    if (!employee) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const stats = await Task.aggregate([
      {
        $match: {
          managerId: new mongoose.Types.ObjectId(managerId),
          employeeId: new mongoose.Types.ObjectId(employeeId),
        },
      },
      {
        $group: {
          _id: "$employeeId",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
        },
      },
      {
        $addFields: {
          completionPercentage: {
            $cond: [
              { $eq: ["$totalTasks", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$completedTasks", "$totalTasks"] },
                      100,
                    ],
                  },
                  0,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.json({
      employee,
      performance:
        stats[0] || {
          totalTasks: 0,
          completedTasks: 0,
          completionPercentage: 0,
        },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
