const express = require("express");
const router = express.Router();

const {
  addUser,
  deleteUser,
  promoteToManager,
  getAllUsers   // ✅ add this
} = require("../../controllers/hr/hrController");

const { protect } = require("../../middleware/authMiddleware");
const { isHR } = require("../../middleware/roleMiddleware");

/* ---------- HR Routes ---------- */

// ✅ Get all employees & managers
router.get("/users", protect, isHR, getAllUsers);

// ✅ Add employee or manager
router.post("/add-user", protect, isHR, addUser);

// ✅ Delete employee or manager
router.delete("/delete-user/:id", protect, isHR, deleteUser);

// ✅ Promote employee to manager
router.put("/promote/:employeeId", protect, isHR, promoteToManager);

module.exports = router;
