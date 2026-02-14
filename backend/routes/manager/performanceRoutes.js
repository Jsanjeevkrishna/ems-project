const express = require("express");
const {
  getTeamPerformance,
  getEmployeePerformance,
} = require("../../controllers/manager/performanceController");

const { protect } = require("../../middleware/authMiddleware");
const { isManager } = require("../../middleware/roleMiddleware");

const router = express.Router();

router.get("/team", protect, isManager, getTeamPerformance);
router.get("/employee/:employeeId", protect, isManager, getEmployeePerformance);

module.exports = router;
