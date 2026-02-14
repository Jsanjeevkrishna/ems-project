const express = require("express");
const {
  requestLeave,
  getAllLeaves,
  updateLeaveStatus,
} = require("../../controllers/hr/leaveController");

const { protect } = require("../../middleware/authMiddleware");
const { isHR } = require("../../middleware/roleMiddleware");

const router = express.Router();

// Employee / Manager
router.post("/request", protect, requestLeave);

// HR
router.get("/all", protect, isHR, getAllLeaves);
router.put("/update/:id", protect, isHR, updateLeaveStatus);

module.exports = router;
