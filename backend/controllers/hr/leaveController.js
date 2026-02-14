const Leave = require("../../models/Leave");

/**
 * Employee / Manager requests leave
 */
exports.requestLeave = async (req, res) => {
  try {
    const { userId, role, fromDate, toDate, reason } = req.body;

    const leave = await Leave.create({
      userId,
      role,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json({
      message: "Leave request submitted",
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * HR views all leave requests
 */
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * HR approves or rejects leave
 */
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json({
      message: `Leave ${status}`,
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
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