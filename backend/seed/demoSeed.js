/**
 * Seed script — creates demo Admin, Manager, Employee, and a sample Project
 * The User model's pre-save hook hashes passwords automatically.
 * Usage: node seed/demoSeed.js
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing demo data
  await User.deleteMany({
    email: {
      $in: ["admin@taskflow.com", "manager@taskflow.com", "member@taskflow.com"],
    },
  });
  await Project.deleteMany({ title: "Demo Project" });

  // ── Create users (model pre-save hook hashes password) ──
  const admin = await User.create({
    name: "Admin User",
    email: "admin@taskflow.com",
    password: "admin123",
    role: "admin",
    isFirstLogin: false,
  });

  const manager = await User.create({
    name: "Manager User",
    email: "manager@taskflow.com",
    password: "manager123",
    role: "manager",
    managerId: admin._id,
    isFirstLogin: false,
  });

  const member = await User.create({
    name: "Member User",
    email: "member@taskflow.com",
    password: "member123",
    role: "employee",
    managerId: manager._id,
    isFirstLogin: false,
  });

  // ── Create sample project ──
  const project = await Project.create({
    title: "Demo Project",
    description: "A sample project to showcase TaskFlow features.",
    status: "active",
    priority: "high",
    adminId: admin._id,
    members: [manager._id, member._id],
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  // ── Create sample tasks ──
  await Task.create([
    {
      title: "Design landing page",
      description: "Create wireframes and mockups for the new landing page",
      status: "completed",
      priority: "high",
      projectId: project._id,
      employeeId: member._id,
      managerId: manager._id,
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (completed, not overdue)
    },
    {
      title: "Set up CI/CD pipeline",
      description: "Configure GitHub Actions for automated testing and deployment",
      status: "in-progress",
      priority: "high",
      projectId: project._id,
      employeeId: member._id,
      managerId: manager._id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // due in 3 days
    },
    {
      title: "Write API documentation",
      description: "Document all REST endpoints with examples",
      status: "pending",
      priority: "medium",
      projectId: project._id,
      employeeId: member._id,
      managerId: manager._id,
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago — OVERDUE
    },
  ]);

  console.log("🌱 Seeded successfully!");
  console.log("  Admin   → admin@taskflow.com   / admin123");
  console.log("  Manager → manager@taskflow.com / manager123");
  console.log("  Member  → member@taskflow.com  / member123");
  console.log(`  Project → "${project.title}"  (${project._id})`);
  console.log("  Tasks   → 3 tasks (1 completed, 1 in-progress, 1 overdue)");

  await mongoose.disconnect();
  console.log("✅ Done");
};

run().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
