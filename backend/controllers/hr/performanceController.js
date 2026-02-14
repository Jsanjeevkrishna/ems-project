const mongoose = require("mongoose");
const Task = require("../../models/Task");
const User = require("../../models/User");

/**
 * HR views ALL managers performance
 */
exports.getManagerPerformance = async (req, res) => {
  try {
    // Get all managers
    const managers = await User.find({ role: "manager" }).select(
      "_id name email"
    );

    const result = [];

    for (const manager of managers) {
      // Manager performance
      const managerStats = await Task.aggregate([
        {
          $match: {
            managerId: manager._id,
          },
        },
        {
          $group: {
            _id: "$managerId",
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: {
                $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
              },
            },
          },
        },
      ]);

      const totalTasks = managerStats[0]?.totalTasks || 0;
      const completedTasks = managerStats[0]?.completedTasks || 0;

      // Get employees under manager
      const employees = await User.find({
        role: "employee",
        managerId: manager._id,
      }).select("_id name email");

      const employeeIds = employees.map((e) => e._id);

      const employeeStats = await Task.aggregate([
        {
          $match: {
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
      ]);

      const teamPerformance = employees.map((emp) => {
        const stat = employeeStats.find(
          (s) => s._id.toString() === emp._id.toString()
        );

        return {
          employeeId: emp._id,
          name: emp.name,
          email: emp.email,
          totalTasks: stat?.totalTasks || 0,
          completedTasks: stat?.completedTasks || 0,
        };
      });

      result.push({
        managerId: manager._id,
        name: manager.name,
        email: manager.email,
        totalTasks,
        completedTasks,
        team: teamPerformance,
      });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * HR views individual employee performance
 */
exports.getEmployeePerformance = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Task.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(id),
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

    res.status(200).json(
      data[0] || {
        totalTasks: 0,
        completedTasks: 0,
        completionPercentage: 0,
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
