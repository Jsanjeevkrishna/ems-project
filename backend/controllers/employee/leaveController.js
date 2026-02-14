const Leave = require("../../models/Leave");

/**
 * Apply for leave
 */
exports.applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason } = req.body;

    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const leave = await Leave.create({
      userId: req.user._id,
      role: req.user.role,
      fromDate,
      toDate,
      reason,
      status: "pending",
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
 * Get own leave history
 */
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
