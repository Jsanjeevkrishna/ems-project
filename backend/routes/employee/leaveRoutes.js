const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  applyLeave,
  getMyLeaves,
} = require("../../controllers/employee/leaveController");

const router = express.Router();

// POST /api/employee/leaves
router.post("/", protect, applyLeave);

// GET /api/employee/leaves
router.get("/", protect, getMyLeaves);

module.exports = router;
