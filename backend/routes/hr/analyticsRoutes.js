const express = require("express");
const { getGenderRatio } = require("../../controllers/hr/analyticsController");

const router = express.Router();

router.get("/gender-ratio", getGenderRatio);

module.exports = router;
