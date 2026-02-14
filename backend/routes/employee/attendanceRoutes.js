const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  markAttendance,
  getMyAttendanceHistory,
} = require("../../controllers/employee/attendanceController");

const router = express.Router();

// POST /api/employee/attendance/mark
router.post("/mark", protect, markAttendance);

// GET /api/employee/attendance
router.get("/", protect, getMyAttendanceHistory);

module.exports = router;
