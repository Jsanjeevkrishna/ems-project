import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./Projects.css";

const STATUS_COLORS = {
  active: "#22c55e",
  completed: "#60a5fa",
  "on-hold": "#f59e0b",
  cancelled: "#ef4444",
};

const PRIORITY_COLORS = {
  low: "#6b7280",
  medium: "#f59e0b",
  high: "#ef4444",
};

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, sRes] = await Promise.all([
          axiosInstance.get("/projects"),
          axiosInstance.get("/projects/stats"),
        ]);
        setProjects(pRes.data);
        setStats(sRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  if (loading) return <div className="pl-loading"><span className="spinner" />Loading projects…</div>;
  if (error) return <div className="pl-error">{error}</div>;

  return (
    <div className="pl-page">
      {/* Header */}
      <div className="pl-header">
        <div>
          <h1 className="pl-title">Projects</h1>
          <p className="pl-sub">Track & manage your team's work</p>
        </div>
        {role === "admin" && (
          <button className="pl-btn-new" onClick={() => navigate("/hr/projects/new")}>
            + New Project
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="pl-stats">
          <div className="pl-stat-card">
            <span className="pl-stat-num">{stats.projects.total}</span>
            <span className="pl-stat-lbl">Total Projects</span>
          </div>
          <div className="pl-stat-card active-card">
            <span className="pl-stat-num">{stats.projects.active}</span>
            <span className="pl-stat-lbl">Active</span>
          </div>
          <div className="pl-stat-card done-card">
            <span className="pl-stat-num">{stats.projects.completed}</span>
            <span className="pl-stat-lbl">Completed</span>
          </div>
          <div className="pl-stat-card task-card">
            <span className="pl-stat-num">{stats.tasks.total}</span>
            <span className="pl-stat-lbl">Total Tasks</span>
          </div>
          <div className="pl-stat-card overdue-card">
            <span className="pl-stat-num">{stats.tasks.overdue}</span>
            <span className="pl-stat-lbl">Overdue</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="pl-filters">
        {["all", "active", "on-hold", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            className={`pl-filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="pl-empty">
          <span>📁</span>
          <p>No projects found</p>
          {role === "admin" && (
            <button className="pl-btn-new" onClick={() => navigate("/hr/projects/new")}>
              Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="pl-grid">
          {filtered.map((p) => (
            <Link key={p._id} to={`/projects/${p._id}`} className="pl-card">
              <div className="pl-card-top">
                <span
                  className="pl-badge"
                  style={{ background: STATUS_COLORS[p.status] + "22", color: STATUS_COLORS[p.status] }}
                >
                  {p.status}
                </span>
                <span
                  className="pl-priority"
                  style={{ color: PRIORITY_COLORS[p.priority] }}
                >
                  ● {p.priority}
                </span>
              </div>

              <h3 className="pl-card-title">{p.title}</h3>
              <p className="pl-card-desc">
                {p.description || "No description provided."}
              </p>

              <div className="pl-card-footer">
                <div className="pl-members">
                  {p.members.slice(0, 4).map((m, i) => (
                    <span key={m._id} className="pl-avatar" title={m.name}>
                      {m.name[0].toUpperCase()}
                    </span>
                  ))}
                  {p.members.length > 4 && (
                    <span className="pl-avatar pl-avatar-more">+{p.members.length - 4}</span>
                  )}
                </div>
                {p.endDate && (
                  <span className="pl-due">
                    Due {new Date(p.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
