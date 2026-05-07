import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./Projects.css";
import "./CreateProject.css";

export default function CreateProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "active",
    priority: "medium",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/projects", form);
      navigate(`/projects/${res.data.project._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-page">
      <button className="pd-back" onClick={() => navigate(-1)}>← Back</button>

      <div className="cp-card">
        <h1 className="cp-title">Create New Project</h1>
        <p className="cp-sub">Set up a project and add your team</p>

        <form onSubmit={handleSubmit} className="cp-form">
          <div className="cp-field">
            <label>Project Title *</label>
            <input
              name="title"
              placeholder="e.g. Website Redesign Q3"
              value={form.title}
              onChange={handleChange}
              required
              className="pd-input"
            />
          </div>

          <div className="cp-field">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="What is this project about?"
              value={form.description}
              onChange={handleChange}
              className="pd-input pd-textarea"
            />
          </div>

          <div className="cp-row">
            <div className="cp-field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="pd-input">
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="cp-field">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="pd-input">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="cp-row">
            <div className="cp-field">
              <label>Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="pd-input" />
            </div>
            <div className="cp-field">
              <label>End / Due Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="pd-input" />
            </div>
          </div>

          {error && <p className="pd-error">{error}</p>}

          <button type="submit" className="cp-btn" disabled={loading}>
            {loading ? "Creating…" : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
