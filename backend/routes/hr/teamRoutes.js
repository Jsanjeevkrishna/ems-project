const express = require("express");
const {
  getManagers,
  getManagerTeam,
} = require("../../controllers/hr/teamController");

const { protect } = require("../../middleware/authMiddleware");
const { isHR } = require("../../middleware/roleMiddleware");

const router = express.Router();

router.get("/managers", protect, isHR, getManagers);
router.get("/team/:managerId", protect, isHR, getManagerTeam);

module.exports = router;
