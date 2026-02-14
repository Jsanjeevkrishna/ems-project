const User = require("../../models/User");

/**
 * Get logged-in employee profile
 */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Complete or update employee profile
 */
exports.updateMyProfile = async (req, res) => {
  try {
    const { phone, place, gender, dob } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.phone = phone;
    user.place = place;
    user.gender = gender;
    user.dob = dob;
    user.profileCompleted = true;

    await user.save();

    res.json({
      message: "Profile completed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
