const User = require("../../models/User");

/**
 * HR views employee or manager profile
 */
exports.viewProfile = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select(
    "name email phone place gender role"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

exports.completeProfile = async (req, res) => {
  try {
    const { phone, place, gender } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.phone = phone;
    user.place = place;
    user.gender = gender;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email phone place gender role"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

