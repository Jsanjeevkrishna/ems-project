const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
} = require("../../controllers/employee/profileController");

const router = express.Router();

// GET /api/employee/profile
router.get("/", protect, getMyProfile);

// PUT /api/employee/profile
router.put("/", protect, updateMyProfile);

module.exports = router;
