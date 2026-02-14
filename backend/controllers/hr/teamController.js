const User = require("../../models/User");

/**
 * HR gets all managers
 */
exports.getManagers = async (req, res) => {
  const managers = await User.find({ role: "manager" }).select("name email");
  res.json(managers);
};

/**
 * HR gets manager + team employees
 */
exports.getManagerTeam = async (req, res) => {
  const { managerId } = req.params;

  const manager = await User.findById(managerId).select("name email");

  const employees = await User.find({
    role: "employee",
    managerId,
  }).select("name email");

  res.json({ manager, employees });
};
