import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./css/HRDashboard.css";


function HRDashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [leaves, setLeaves] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emp, att, lev] = await Promise.all([
          axiosInstance.get("/hr/dashboard/employees"),
          axiosInstance.get("/hr/dashboard/attendance/today"),
          axiosInstance.get("/hr/dashboard/leaves/pending"),
        ]);

        setSummary(emp.data);
        setAttendance(att.data);
        setLeaves(lev.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
  <div className="hr-dashboard-wrapper">
    <div className="hr-dashboard-card">
      <h1 className="hr-dashboard-title">HR Dashboard</h1>

      {/* ===== Summary Section ===== */}
      <div className="hr-summary-grid">
        <div className="hr-summary-card">
          <h3>Total Employees</h3>
          <div className="hr-stat">{summary?.totalEmployees || 0}</div>
        </div>

        <div className="hr-summary-card">
          <h3>Total Managers</h3>
          <div className="hr-stat">{summary?.totalManagers || 0}</div>
        </div>

        <div className="hr-summary-card">
          <h3>Present Today</h3>
          <div className="hr-stat">{attendance?.present || 0}</div>
        </div>

        <div className="hr-summary-card">
          <h3>Pending Leaves</h3>
          <div className="hr-stat">{leaves?.pendingLeaves || 0}</div>
        </div>
      </div>

      {/* ===== Features Section ===== */}
     <h2 className="hr-title">HR Features</h2>


      <div className="hr-feature-grid">
        {[
          { name: "Manage Users", path: "/hr/users" },
          { name: "Attendance", path: "/hr/attendance" },
          { name: "Leave Management", path: "/hr/leaves" },
          { name: "Payroll", path: "/hr/payroll" },
          { name: "Performance", path: "/hr/performance" },
          { name: "Search Employees", path: "/hr/search" },
          { name: "Teams", path: "/hr/teams" },
          { name: "Analytics", path: "/hr/analytics" },
        ].map((item, index) => (
          <div
            key={index}
            className="hr-feature-card"
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  </div>
);
}
export default HRDashboard;
