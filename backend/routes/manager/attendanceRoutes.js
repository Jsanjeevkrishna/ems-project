const express = require("express");
const {
  getTeamAttendance,
  getTodayTeamAttendanceSummary,
} = require("../../controllers/manager/attendanceController");

const { protect } = require("../../middleware/authMiddleware");
const { isManager } = require("../../middleware/roleMiddleware");

const router = express.Router();

/**
 * Full team attendance
 */
router.get("/team", protect, isManager, getTeamAttendance);

/**
 * Today's team attendance summary
 */
router.get("/team/summary", protect, isManager, getTodayTeamAttendanceSummary);

module.exports = router;
