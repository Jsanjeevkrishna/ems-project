const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  getEmployeeDashboard,
} = require("../../controllers/employee/dashboardController");

const router = express.Router();

// GET /api/employee/dashboard
router.get("/", protect, getEmployeeDashboard);

module.exports = router;
