const User = require("../../models/User");

/**
 * HR dashboard gender ratio
 */
exports.getGenderRatio = async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $match: {
          role: "employee", // only employees, not HR or managers
        },
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
    ]);

    let total = 0;
    data.forEach((d) => (total += d.count));

    const result = data.map((d) => ({
      gender: d._id,
      count: d.count,
      percentage: total === 0 ? 0 : Math.round((d.count / total) * 100),
    }));

    res.status(200).json({
      totalEmployees: total,
      breakdown: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
