const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  createRoom,
  getRooms,
  getRoomById,
  deleteRoom,
  getEmployeeRooms,
} = require("../../controllers/common/teamChatController");

const router = express.Router();

/* Manager */
router.post("/", protect, createRoom);
router.get("/manager", protect, getRooms);

/* Employee */
router.get("/employee", protect, getEmployeeRooms);

/* Common */
router.get("/:id", protect, getRoomById);
router.delete("/:id", protect, deleteRoom);

module.exports = router;
