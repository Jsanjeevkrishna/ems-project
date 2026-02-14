import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./css/employeeLayout.css";

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const goToProfile = () => {
    navigate("/employee/profile");
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  return (
    <div className="employee-page">

      {/* ===== HEADER BAR ===== */}
      <header className="employee-header">

        {/* Left */}
        <div className="header-left">
          <p className="welcome-text">Welcome, {user?.name} 👋</p>
          <h1>Employee Panel</h1>
        </div>

        {/* Center Navigation */}
        <nav className="header-nav">
          <NavLink to="dashboard" className="nav-btn">Dashboard</NavLink>
          <NavLink to="attendance" className="nav-btn">Attendance</NavLink>
          <NavLink to="leaves" className="nav-btn">Leaves</NavLink>
          <NavLink to="tasks" className="nav-btn">Tasks</NavLink>
          <NavLink to="chat" className="nav-btn">Team Chat</NavLink>
        </nav>

        {/* Right */}
        <div className="header-right">
          <div 
            className="profile-circle"
            onClick={goToProfile}
            style={{ cursor: "pointer" }}
          >
            {firstLetter}
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
