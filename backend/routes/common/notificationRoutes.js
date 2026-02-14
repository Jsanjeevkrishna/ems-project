const express = require("express");
const {
  getMyNotifications,
} = require("../../controllers/common/notificationController");

const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * Get unread notifications for logged-in user
 */
router.get("/", protect, getMyNotifications);

module.exports = router;
