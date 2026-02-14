const Notification = require("../../models/Notification");

/**
 * Get unread notifications
 */
exports.getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user._id,
    isRead: false,
  }).sort({ createdAt: -1 });

  res.json(notifications);
};
