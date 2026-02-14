const Leave = require("../../models/Leave");

/**
 * Manager approves leave
 */
exports.approveLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;

    const leave = await Leave.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // manager approves (HR still final)
    leave.managerStatus = "approved";

    await leave.save();

    res.json({
      message: "Leave approved by manager",
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * Manager forwards leave to HR
 */
exports.forwardLeaveToHR = async (req, res) => {
  try {
    const { leaveId } = req.params;

    const leave = await Leave.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.managerStatus = "forwarded";

    await leave.save();

    res.json({
      message: "Leave forwarded to HR",
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

 
exports.getTeamLeaves = async (req, res) => {
  try {
    const managerId = req.user.id; // IMPORTANT: use id not _id

    // get employees under manager
    const employees = await User.find({
      managerId,
      role: "employee",
    }).select("_id");

    const employeeIds = employees.map((e) => e._id);

    const leaves = await Leave.find({
      userId: { $in: employeeIds },
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};