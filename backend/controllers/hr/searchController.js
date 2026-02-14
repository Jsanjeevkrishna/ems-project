const User = require("../../models/User");

/**
 * HR Smart Search
 * Query params:
 * ?keyword=abc
 * ?role=employee | manager | all
 */
exports.searchUsers = async (req, res) => {
  try {
    const { keyword = "", role = "all" } = req.query;

    let filter = {};

    // Role filter
    if (role !== "all") {
      filter.role = role;
    } else {
      filter.role = { $in: ["employee", "manager"] };
    }

    // Keyword search (name OR email)
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .populate("managerId", "name")
      .select("name email role managerId");

    res.status(200).json(users);
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
