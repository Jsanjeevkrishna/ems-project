const Project = require("../../models/Project");
const Task = require("../../models/Task");
const User = require("../../models/User");
const mongoose = require("mongoose");

/* ────────────────────────────────────────────
   CREATE PROJECT  (admin only)
──────────────────────────────────────────── */
exports.createProject = async (req, res) => {
  try {
    const { title, description, status, priority, startDate, endDate, members } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const project = await Project.create({
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      adminId: req.user._id,
      members: members || [],
    });

    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ────────────────────────────────────────────
   GET ALL PROJECTS
   admin → all projects
   others → projects they are a member of
──────────────────────────────────────────── */
exports.getAllProjects = async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== "admin") {
      query = { members: req.user._id };
    }

    const projects = await Project.find(query)
      .populate("adminId", "name email")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ────────────────────────────────────────────
   GET SINGLE PROJECT
──────────────────────────────────────────── */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("adminId", "name email")
      .populate("members", "name email role");

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Non-admin can only view projects they belong to
    if (
      req.user.role !== "admin" &&
      !project.members.some((m) => m._id.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ────────────────────────────────────────────
   UPDATE PROJECT  (admin only)
──────────────────────────────────────────── */
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { title, description, status, priority, startDate, endDate } = req.body;
    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;
    if (priority) project.priority = priority;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;

    await project.save();
    res.json({ message: "Project updated", project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ────────────────────────────────────────────
   DELETE PROJECT  (admin only)
──────────────────────────────────────────── */
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Remove associated tasks
    await Task.deleteMany({ projectId: req.params.id });

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ────────────────────────────────────────────
   ADD MEMBER  (admin only)
──────────────────────────────────────────── */
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    project.members.push(userId);
    await project.save();

    const updated = await Project.findById(req.params.id).populate("members", "name email role");
    res.json({ message: "Member added", project: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ────────────────────────────────────────────
   REMOVE MEMBER  (admin only)
──────────────────────────────────────────── */
exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.members = project.members.filter(
      (m) => m.toString() !== req.params.userId
    );
    await project.save();

    const updated = await Project.findById(req.params.id).populate("members", "name email role");
    res.json({ message: "Member removed", project: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ────────────────────────────────────────────
   GET PROJECT TASKS
──────────────────────────────────────────── */
exports.getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Access check
    if (
      req.user.role !== "admin" &&
      !project.members.some((m) => m.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await Task.find({ projectId: req.params.id })
      .populate("employeeId", "name email")
      .populate("managerId", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ────────────────────────────────────────────
   CREATE TASK WITHIN PROJECT  (manager / admin)
──────────────────────────────────────────── */
exports.createProjectTask = async (req, res) => {
  try {
    const { title, description, employeeId, dueDate, priority } = req.body;
    const projectId = req.params.id;

    if (!title || !employeeId)
      return res.status(400).json({ message: "title and employeeId are required" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = await Task.create({
      title,
      description,
      employeeId,
      managerId: req.user._id,
      projectId,
      dueDate,
      priority,
    });

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ────────────────────────────────────────────
   GET PROJECT STATS  (dashboard)
──────────────────────────────────────────── */
exports.getProjectStats = async (req, res) => {
  try {
    const now = new Date();

    let projectQuery = {};
    if (req.user.role !== "admin") {
      projectQuery = { members: req.user._id };
    }

    const [totalProjects, activeProjects, completedProjects] = await Promise.all([
      Project.countDocuments(projectQuery),
      Project.countDocuments({ ...projectQuery, status: "active" }),
      Project.countDocuments({ ...projectQuery, status: "completed" }),
    ]);

    // Tasks scoped to the user's projects
    const userProjects = await Project.find(projectQuery).select("_id");
    const projectIds = userProjects.map((p) => p._id);

    let taskQuery = { projectId: { $in: projectIds } };
    if (req.user.role === "employee") taskQuery.employeeId = req.user._id;
    if (req.user.role === "manager") taskQuery.managerId = req.user._id;

    const [totalTasks, completedTasks, inProgressTasks, overdueTasks] = await Promise.all([
      Task.countDocuments(taskQuery),
      Task.countDocuments({ ...taskQuery, status: "completed" }),
      Task.countDocuments({ ...taskQuery, status: "in-progress" }),
      Task.countDocuments({
        ...taskQuery,
        status: { $ne: "completed" },
        dueDate: { $lt: now },
      }),
    ]);

    res.json({
      projects: { total: totalProjects, active: activeProjects, completed: completedProjects },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        pending: totalTasks - completedTasks - inProgressTasks,
        overdue: overdueTasks,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ────────────────────────────────────────────
   GET ALL USERS  (for member selection)
──────────────────────────────────────────── */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
