import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/ManagerDashboard.css";

export default function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
       const res = await axiosInstance.get("/manager/dashboard/summary");

        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

 return (
  <div className="dashboard-wrapper">
    <h2 className="dashboard-title">Manager Dashboard</h2>

    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h3>Team Size</h3>
        <p>{data.teamSize}</p>
      </div>

      <div className="dashboard-card">
        <h3>Total Tasks</h3>
        <p>{data.tasks.total}</p>
      </div>

      <div className="dashboard-card">
        <h3>Completed</h3>
        <p>{data.tasks.completed}</p>
      </div>

      <div className="dashboard-card">
        <h3>Pending</h3>
        <p>{data.tasks.pending}</p>
      </div>

      <div className="dashboard-card present">
        <h3>Present</h3>
        <p>{data.attendance.present}</p>
      </div>

      <div className="dashboard-card absent">
        <h3>Absent</h3>
        <p>{data.attendance.absent}</p>
      </div>
    </div>
  </div>
);

}

const cardStyle = {
  background: "#1f2937",
  padding: "20px",
  borderRadius: "10px",
  minWidth: "180px",
  color: "white"
};
