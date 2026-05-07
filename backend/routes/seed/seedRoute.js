const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Project = require("../../models/Project");
const Task = require("../../models/Task");

// Secret key guard — only works with ?key=seed_taskflow_2024
router.post("/", async (req, res) => {
  if (req.query.key !== "seed_taskflow_2024") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    // Clear existing demo accounts only
    await User.deleteMany({ email: { $in: ["admin@taskflow.com", "manager@taskflow.com", "employee@taskflow.com"] } });
    await Project.deleteMany({ title: "TaskFlow Platform" });

    // Create users
    const admin = await User.create({ name: "Admin User", email: "admin@taskflow.com", password: "admin123", role: "admin", isFirstLogin: false });
    const manager = await User.create({ name: "Sarah Manager", email: "manager@taskflow.com", password: "manager123", role: "manager", isFirstLogin: false });
    const employee = await User.create({ name: "John Employee", email: "employee@taskflow.com", password: "employee123", role: "employee", isFirstLogin: false });

    // Create project
    const project = await Project.create({
      title: "TaskFlow Platform",
      description: "Build the TaskFlow project management web app with role-based access control.",
      status: "active",
      priority: "high",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      adminId: admin._id,
      members: [manager._id, employee._id],
    });

    // Create tasks
    await Task.create([
      { title: "Design database schema", description: "Model User, Project, Task relationships", status: "completed", priority: "high", projectId: project._id, assignedTo: employee._id, dueDate: new Date(Date.now() - 5 * 86400000) },
      { title: "Build REST API", description: "Auth, Projects, Tasks endpoints", status: "in-progress", priority: "high", projectId: project._id, assignedTo: manager._id, dueDate: new Date(Date.now() + 7 * 86400000) },
      { title: "Deploy to production", description: "Railway/Render deployment with env vars", status: "pending", priority: "medium", projectId: project._id, assignedTo: employee._id, dueDate: new Date(Date.now() + 14 * 86400000) },
    ]);

    res.json({ message: "✅ Demo data seeded!", users: ["admin@taskflow.com", "manager@taskflow.com", "employee@taskflow.com"], project: project.title });
  } catch (err) {
    res.status(500).json({ message: "Seed failed", error: err.message });
  }
});

module.exports = router;
