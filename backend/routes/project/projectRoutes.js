const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectTasks,
  createProjectTask,
  getProjectStats,
  getAllUsers,
} = require("../../controllers/project/projectController");

const { protect } = require("../../middleware/authMiddleware");
const { isHR } = require("../../middleware/roleMiddleware");

/* ── Stats (all authenticated) ── */
router.get("/stats", protect, getProjectStats);

/* ── All users list (for member picker, admin only) ── */
router.get("/users", protect, isHR, getAllUsers);

/* ── Project CRUD ── */
router.post("/", protect, isHR, createProject);
router.get("/", protect, getAllProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, isHR, updateProject);
router.delete("/:id", protect, isHR, deleteProject);

/* ── Member management (admin only) ── */
router.post("/:id/members", protect, isHR, addMember);
router.delete("/:id/members/:userId", protect, isHR, removeMember);

/* ── Task management within project ── */
router.get("/:id/tasks", protect, getProjectTasks);
router.post("/:id/tasks", protect, createProjectTask);

module.exports = router;
