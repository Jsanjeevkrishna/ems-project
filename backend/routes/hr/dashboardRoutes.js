const express = require("express");
const {
  getEmployeeSummary,
  getTodayAttendanceSummary,
  getPendingLeaveCount,
} = require("../../controllers/hr/dashboardController");

const { protect } = require("../../middleware/authMiddleware");
const { isHR } = require("../../middleware/roleMiddleware");

const router = express.Router();

router.get("/employees", protect, isHR, getEmployeeSummary);
router.get("/attendance/today", protect, isHR, getTodayAttendanceSummary);
router.get("/leaves/pending", protect, isHR, getPendingLeaveCount);

module.exports = router;
