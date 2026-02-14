const express = require("express");
const { approveLeave } = require("../../controllers/manager/leaveController");
const { protect } = require("../../middleware/authMiddleware");
const { isManager } = require("../../middleware/roleMiddleware");
const { forwardLeaveToHR } = require("../../controllers/manager/leaveController");
const { getTeamLeaves } = require("../../controllers/manager/leaveController");


const router = express.Router();


router.put("/forward/:leaveId", protect, isManager, forwardLeaveToHR);


router.put("/approve/:leaveId", protect, isManager, approveLeave);
router.get("/team", protect, isManager, getTeamLeaves);


module.exports = router;
