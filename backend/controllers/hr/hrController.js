const User = require("../../models/User");

/**
 * HR adds Manager or Employee
 */
exports.addUser = async (req, res) => {
  try {
    const { name, email, role, managerId } = req.body;

    if (!["manager", "employee"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (role === "employee" && !managerId) {
      return res.status(400).json({
        message: "managerId is required for employee",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      role,
      managerId: role === "employee" ? managerId : null,
      password: "",              // No password initially
      isFirstLogin: true,        // Must set password
    });

    res.status(201).json({
      message: `${role} created successfully`,
      user,
    });

  }catch (error) {
  console.log("ADD USER ERROR:", error);
  res.status(500).json({ message: error.message });
}

};

/**
 * HR deletes Manager or Employee
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // HR should not delete another HR
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete HR" });
    }

    await user.deleteOne();

    res.json({
      message: `${user.role} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
 
exports.promoteToManager = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const user = await User.findById(employeeId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "employee") {
      return res.status(400).json({
        message: "Only employees can be promoted to manager",
      });
    }

    // promote
    user.role = "manager";
    user.managerId = null;

    await user.save();

    res.json({
      message: "Employee promoted to manager successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["manager", "employee"] },
    }).select("name email role managerId");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};