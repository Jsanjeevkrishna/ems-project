import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../utils/auth";

function HRLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const btnStyle = (path) => ({
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    background: isActive(path) ? "#2563eb" : "transparent",
    color: "white",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s ease",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      
      {/* SIDEBAR */}
      <aside
        style={{
          width: "240px",
          background: "#111827",
          padding: "25px",
          borderRight: "1px solid #1e293b",
        }}
      >
       <h2 className="hr-title">HR Panel</h2>


        <button style={btnStyle("/hr/dashboard")} onClick={() => navigate("/hr/dashboard")}>🏠 Dashboard</button>
        <button style={btnStyle("/hr/users")} onClick={() => navigate("/hr/users")}>👥 Manage Users</button>
        <button style={btnStyle("/hr/projects")} onClick={() => navigate("/hr/projects")}>📁 Projects</button>
        <button style={btnStyle("/hr/attendance")} onClick={() => navigate("/hr/attendance")}>📋 Attendance</button>
        <button style={btnStyle("/hr/leaves")} onClick={() => navigate("/hr/leaves")}>🏖 Leaves</button>
        <button style={btnStyle("/hr/payroll")} onClick={() => navigate("/hr/payroll")}>💰 Payroll</button>
        <button style={btnStyle("/hr/performance")} onClick={() => navigate("/hr/performance")}>📊 Performance</button>
        <button style={btnStyle("/hr/search")} onClick={() => navigate("/hr/search")}>🔍 Search</button>

        <hr style={{ margin: "25px 0", borderColor: "#1e293b" }} />

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default HRLayout;
