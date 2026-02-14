import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/employee/dashboard");
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  if (!summary) return <p>Loading...</p>;

return (
  <div className="dashboard-container">
    <h1 className="dashboard-title">Employee Dashboard</h1>

    <div className="dashboard-cards">
      <div className="dashboard-card">
        <h3>Attendance %</h3>
        <p>{summary.attendancePercentage}%</p>
      </div>

      <div className="dashboard-card">
        <h3>Tasks</h3>
        <p>{summary.tasksCount}</p>
      </div>

      <div className="dashboard-card">
        <h3>Pending Leaves</h3>
        <p>{summary.pendingLeaves}</p>
      </div>

      <div className="dashboard-card">
        <h3>Performance</h3>
        <p>{summary.performance || "N/A"}</p>
      </div>
    </div>
  </div>
);

};

export default EmployeeDashboard;
