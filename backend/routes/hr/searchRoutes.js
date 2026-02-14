const express = require("express");
const { searchUsers } = require("../../controllers/hr/searchController");
const { protect } = require("../../middleware/authMiddleware");
const { isHR } = require("../../middleware/roleMiddleware");

const router = express.Router();

// GET /api/hr/search?keyword=&role=
router.get("/", protect, isHR, searchUsers);

module.exports = router;
