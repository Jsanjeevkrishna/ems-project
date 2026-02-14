const Payroll = require("../../models/Payroll");

/**
 * HR creates or updates payroll
 */
exports.createOrUpdatePayroll = async (req, res) => {
  try {
    const { employeeId, salary, month } = req.body;

    const payroll = await Payroll.findOneAndUpdate(
      { employeeId, month },
      { salary },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Payroll saved",
      payroll,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * HR views all payrolls
 */
exports.getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employeeId", "name email")
      .sort({ createdAt: -1 });

    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * HR marks salary as paid
 */
exports.markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const payroll = await Payroll.findByIdAndUpdate(
      id,
      { status: "paid" },
      { new: true }
    );

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.json({
      message: "Salary marked as paid",
      payroll,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
