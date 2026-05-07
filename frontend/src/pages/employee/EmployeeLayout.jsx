import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./css/employeeLayout.css";

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Employee";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="employee-page">

      {/* ===== HEADER BAR ===== */}
      <header className="employee-header">

        {/* Left */}
        <div className="header-left">
          <p className="welcome-text">Welcome, {name} 👋</p>
          <h1>Employee Panel</h1>
        </div>

        {/* Center Navigation */}
        <nav className="header-nav">
          <NavLink to="dashboard" className="nav-btn">Dashboard</NavLink>
          <NavLink to="projects" className="nav-btn">📁 Projects</NavLink>
          <NavLink to="tasks" className="nav-btn">Tasks</NavLink>
          <NavLink to="attendance" className="nav-btn">Attendance</NavLink>
          <NavLink to="leaves" className="nav-btn">Leaves</NavLink>
          <NavLink to="chat" className="nav-btn">Team Chat</NavLink>
        </nav>

        {/* Right */}
        <div className="header-right">
          <div
            className="profile-circle"
            onClick={() => navigate("/employee/profile")}
            style={{ cursor: "pointer" }}
          >
            {name.charAt(0).toUpperCase()}
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </header>

      {/* ===== CONTENT AREA ===== */}
      <main className="employee-content">
        <Outlet />
      </main>

    </div>
  );
}

