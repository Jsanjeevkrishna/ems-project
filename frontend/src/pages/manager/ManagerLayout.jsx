import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./css/ManagerLayout.css";

export default function ManagerLayout() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "Manager";

  const linkStyle = ({ isActive }) => ({
    padding: "8px 16px",
    borderRadius: "8px",
    backgroundColor: isActive ? "#2563eb" : "#1f2937",
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
    transition: "0.3s",
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="manager-layout">
      
      {/* HEADER */}
      <div className="manager-header">

        {/* LEFT SIDE */}
        <div className="header-left">
          <h4 className="welcome-text">
            Welcome, {name} 👋
          </h4>
          <h2 className="manager-title">
            Manager Panel
          </h2>
        </div>

        {/* CENTER NAVIGATION */}
        <div className="nav-links">
          <NavLink to="dashboard" style={linkStyle}>Dashboard</NavLink>
          <NavLink to="projects" style={linkStyle}>📁 Projects</NavLink>
          <NavLink to="tasks" style={linkStyle}>Tasks</NavLink>
          <NavLink to="attendance" style={linkStyle}>Attendance</NavLink>
          <NavLink to="leaves" style={linkStyle}>Leaves</NavLink>
          <NavLink to="performance" style={linkStyle}>Performance</NavLink>
          <NavLink to="team-chat" style={linkStyle}>Team Chat</NavLink>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">
          <div
            className="profile-icon"
            onClick={() => navigate("profile")}
          >
            {name.charAt(0).toUpperCase()}
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="manager-content">
        <Outlet />
      </div>

    </div>
  );
}
