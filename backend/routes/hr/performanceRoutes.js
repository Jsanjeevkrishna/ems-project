const express = require("express");
const router = express.Router();

const {
  getManagerPerformance,
  getEmployeePerformance,
} = require("../../controllers/hr/performanceController");

const { protect } = require("../../middleware/authMiddleware");
const { isHR } = require("../../middleware/roleMiddleware");

router.get("/managers", protect, isHR, getManagerPerformance);
router.get("/employee/:id", protect, isHR, getEmployeePerformance);

module.exports = router;
