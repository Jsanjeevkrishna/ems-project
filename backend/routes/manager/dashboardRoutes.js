const express = require("express");
const {
  getDashboardSummary,
} = require("../../controllers/manager/dashboardController");

const { protect } = require("../../middleware/authMiddleware");
const { isManager } = require("../../middleware/roleMiddleware");

const router = express.Router();

router.get("/summary", protect, isManager, getDashboardSummary);

module.exports = router;
