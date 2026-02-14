const express = require("express");
const {
  createTask,
  getMyTasks,
} = require("../../controllers/manager/taskController");

const { protect } = require("../../middleware/authMiddleware");
const { isManager } = require("../../middleware/roleMiddleware");
const { getTeamMembers } = require("../../controllers/manager/taskController");


const router = express.Router();

router.post("/create", protect, isManager, createTask);
router.get("/", protect, isManager, getMyTasks);
router.get("/team", protect, isManager, getTeamMembers);


module.exports = router;
