import { useNavigate } from "react-router-dom";
import "./SelectRole.css";

export default function SelectRole() {
  const navigate = useNavigate();

  return (
    <div className="role-page">
      <div className="role-card">
        <h2 className="role-title">Select Role</h2>

        <button
          className="role-btn"
          onClick={() => navigate("/login/hr")}
        >
          HR
        </button>

        <button
          className="role-btn"
          onClick={() => navigate("/login/manager")}
        >
          Manager
        </button>

        <button
          className="role-btn"
          onClick={() => navigate("/login/employee")}
        >
          Employee
        </button>
      </div>
    </div>
  );
}
