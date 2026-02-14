const express = require("express");
const {
  markAttendance,
  getTodaySummary,
  getTodayAttendance,
} = require("../../controllers/hr/attendanceController");

const { protect } = require("../../middleware/authMiddleware");
const { isHR } = require("../../middleware/roleMiddleware");

const router = express.Router();

// Employee / Manager marks attendance
router.post("/mark", protect, markAttendance);

// HR only
router.get("/summary/today", protect, isHR, getTodaySummary);
router.get("/today", protect, isHR, getTodayAttendance);

module.exports = router;
