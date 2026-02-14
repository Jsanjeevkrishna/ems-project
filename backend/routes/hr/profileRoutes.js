const express = require("express");
const { viewProfile } = require("../../controllers/common/profileController");
const { protect } = require("../../middleware/authMiddleware");
const { isHR } = require("../../middleware/roleMiddleware");

const router = express.Router();

router.get("/:id", protect, isHR, viewProfile);

module.exports = router;
