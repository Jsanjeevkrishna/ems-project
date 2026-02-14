const express = require("express");
const {
  completeProfile,
  getMyProfile,
} = require("../../controllers/common/profileController");

const { protect } = require("../../middleware/authMiddleware");
const { isManager } = require("../../middleware/roleMiddleware");

const router = express.Router();

router.get("/me", protect, isManager, getMyProfile);
router.put("/complete-profile", protect, isManager, completeProfile);

module.exports = router;
