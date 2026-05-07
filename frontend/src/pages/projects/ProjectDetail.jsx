import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./Projects.css";
import "./ProjectDetail.css";

const STATUS_COLORS = {
  active: "#22c55e",
  completed: "#60a5fa",
  "on-hold": "#f59e0b",
  cancelled: "#ef4444",
};

const PRIORITY_COLORS = { low: "#6b7280", medium: "#f59e0b", high: "#ef4444" };
const TASK_STATUS_COLORS = {
  pending: "#f59e0b",
  "in-progress": "#60a5fa",
  completed: "#22c55e",
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Task form state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "", description: "", employeeId: "", dueDate: "", priority: "medium",
  });
  const [taskError, setTaskError] = useState("");

  // Member add state
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  // Task status update
  const [updatingTask, setUpdatingTask] = useState(null);

  const fetchProject = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        axiosInstance.get(`/projects/${id}`),
        axiosInstance.get(`/projects/${id}/tasks`),
      ]);
      setProject(pRes.data);
      setTasks(tRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (role !== "admin") return;
    const res = await axiosInstance.get("/projects/users");
    setAllUsers(res.data);
  };

  useEffect(() => { fetchProject(); fetchUsers(); }, [id]);

  /* ── Create Task ── */
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError("");
    try {
      await axiosInstance.post(`/projects/${id}/tasks`, taskForm);
      setTaskForm({ title: "", description: "", employeeId: "", dueDate: "", priority: "medium" });
      setShowTaskForm(false);
      fetchProject();
    } catch (err) {
      setTaskError(err.response?.data?.message || "Failed to create task");
    }
  };

  /* ── Update Task Status ── */
  const handleStatusChange = async (taskId, status) => {
    setUpdatingTask(taskId);
    try {
      const isEmployee = role === "employee";
      const endpoint = isEmployee
        ? `/employee/tasks/${taskId}/status`
        : `/manager/tasks/${taskId}/status`;
      await axiosInstance.patch(endpoint, { status });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingTask(null);
    }
  };

  /* ── Add Member ── */
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/projects/${id}/members`, { userId: selectedUser });
      setSelectedUser("");
      setShowMemberForm(false);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add member");
    }
  };

  /* ── Remove Member ── */
  const handleRemoveMember = async (memberId) => {
    if (!confirm("Remove this member?")) return;
    try {
      await axiosInstance.delete(`/projects/${id}/members/${memberId}`);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove member");
    }
  };

  /* ── Delete Project ── */
  const handleDeleteProject = async () => {
    if (!confirm("Delete this project and all its tasks? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/projects/${id}`);
      navigate("/hr/projects");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <div className="pl-loading"><span className="spinner" />Loading…</div>;
  if (error) return <div className="pl-error">{error}</div>;
  if (!project) return null;

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    overdue: tasks.filter((t) => t.status !== "completed" && t.dueDate && new Date(t.dueDate) < new Date()).length,
  };

  const progress = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;

  const nonMembers = allUsers.filter(
    (u) => !project.members.some((m) => m._id === u._id)
  );

  return (
    <div className="pd-page">
      {/* Back */}
      <button className="pd-back" onClick={() => navigate(-1)}>← Back</button>

      {/* Header */}
      <div className="pd-header">
        <div className="pd-header-left">
          <div className="pd-badges">
            <span className="pl-badge" style={{ background: STATUS_COLORS[project.status] + "22", color: STATUS_COLORS[project.status] }}>
              {project.status}
            </span>
            <span className="pl-priority" style={{ color: PRIORITY_COLORS[project.priority] }}>
              ● {project.priority} priority
            </span>
          </div>
          <h1 className="pd-title">{project.title}</h1>
          {project.description && <p className="pd-desc">{project.description}</p>}
          <div className="pd-meta">
            <span>👤 {project.adminId?.name}</span>
            {project.startDate && <span>📅 {new Date(project.startDate).toLocaleDateString()}</span>}
            {project.endDate && <span>🏁 {new Date(project.endDate).toLocaleDateString()}</span>}
          </div>
        </div>

        {role === "admin" && (
          <div className="pd-header-actions">
            <button className="pd-btn-danger" onClick={handleDeleteProject}>Delete Project</button>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="pd-progress-card">
        <div className="pd-progress-header">
          <span>Overall Progress</span>
          <span className="pd-progress-pct">{progress}%</span>
        </div>
        <div className="pd-progress-bar">
          <div className="pd-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="pd-task-stats">
          <span style={{ color: "#f59e0b" }}>⏳ {taskStats.pending} pending</span>
          <span style={{ color: "#60a5fa" }}>🔄 {taskStats.inProgress} in-progress</span>
          <span style={{ color: "#22c55e" }}>✅ {taskStats.completed} completed</span>
          {taskStats.overdue > 0 && <span style={{ color: "#ef4444" }}>⚠ {taskStats.overdue} overdue</span>}
        </div>
      </div>

      <div className="pd-body">
        {/* Tasks Column */}
        <div className="pd-tasks-col">
          <div className="pd-section-header">
            <h2>Tasks</h2>
            {(role === "admin" || role === "manager") && (
              <button className="pd-btn-add" onClick={() => setShowTaskForm(!showTaskForm)}>
                {showTaskForm ? "Cancel" : "+ Add Task"}
              </button>
            )}
          </div>

          {/* Task Form */}
          {showTaskForm && (
            <form className="pd-form" onSubmit={handleCreateTask}>
              <input
                className="pd-input"
                placeholder="Task title *"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
              />
              <textarea
                className="pd-input pd-textarea"
                placeholder="Description (optional)"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              />
              <select
                className="pd-input"
                value={taskForm.employeeId}
                onChange={(e) => setTaskForm({ ...taskForm, employeeId: e.target.value })}
                required
              >
                <option value="">Assign to…</option>
                {project.members.map((m) => (
                  <option key={m._id} value={m._id}>{m.name} ({m.role})</option>
                ))}
              </select>
              <div className="pd-form-row">
                <input
                  className="pd-input"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
                <select
                  className="pd-input"
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              {taskError && <p className="pd-error">{taskError}</p>}
              <button type="submit" className="pd-btn-submit">Create Task</button>
            </form>
          )}

          {/* Task List */}
          {tasks.length === 0 ? (
            <div className="pd-empty">No tasks yet</div>
          ) : (
            <div className="pd-task-list">
              {tasks.map((task) => {
                const isOverdue = task.status !== "completed" && task.dueDate && new Date(task.dueDate) < new Date();
                return (
                  <div key={task._id} className={`pd-task-card ${isOverdue ? "overdue" : ""}`}>
                    <div className="pd-task-top">
                      <span
                        className="pd-task-status"
                        style={{ background: TASK_STATUS_COLORS[task.status] + "22", color: TASK_STATUS_COLORS[task.status] }}
                      >
                        {task.status}
                      </span>
                      <span className="pd-task-priority" style={{ color: PRIORITY_COLORS[task.priority] }}>
                        ● {task.priority}
                      </span>
                    </div>

                    <h4 className="pd-task-title">{task.title}</h4>
                    {task.description && <p className="pd-task-desc">{task.description}</p>}

                    <div className="pd-task-meta">
                      <span>👤 {task.employeeId?.name}</span>
                      {task.dueDate && (
                        <span style={{ color: isOverdue ? "#ef4444" : "#64748b" }}>
                          {isOverdue ? "⚠ Overdue · " : "📅 "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Status changer */}
                    {(role === "admin" || role === "manager" ||
                      (role === "employee" && task.employeeId?._id === userId)) && (
                      <div className="pd-task-actions">
                        <select
                          className="pd-status-select"
                          value={task.status}
                          disabled={updatingTask === task._id}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Members Column */}
        <div className="pd-members-col">
          <div className="pd-section-header">
            <h2>Team Members</h2>
            {role === "admin" && (
              <button className="pd-btn-add" onClick={() => setShowMemberForm(!showMemberForm)}>
                {showMemberForm ? "Cancel" : "+ Add"}
              </button>
            )}
          </div>

          {/* Add Member Form */}
          {showMemberForm && role === "admin" && (
            <form className="pd-form" onSubmit={handleAddMember}>
              <select
                className="pd-input"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
              >
                <option value="">Select user…</option>
                {nonMembers.map((u) => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))}
              </select>
              <button type="submit" className="pd-btn-submit">Add Member</button>
            </form>
          )}

          {/* Members list */}
          <div className="pd-member-list">
            {project.members.map((m) => (
              <div key={m._id} className="pd-member-item">
                <div className="pl-avatar">{m.name[0].toUpperCase()}</div>
                <div className="pd-member-info">
                  <span className="pd-member-name">{m.name}</span>
                  <span className="pd-member-role">{m.role}</span>
                </div>
                {role === "admin" && (
                  <button
                    className="pd-member-remove"
                    onClick={() => handleRemoveMember(m._id)}
                    title="Remove member"
                  >✕</button>
                )}
              </div>
            ))}
            {project.members.length === 0 && (
              <p className="pd-empty">No members yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
