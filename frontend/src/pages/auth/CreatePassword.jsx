import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./CreatePassword.css";

function CreatePassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, role } = location.state || {};

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/auth/set-password", {
        userId,
        password,
      });

      alert("Password created successfully. Please login again.");

      if (role === "manager") {
        navigate("/login/manager");
      } else if (role === "employee") {
        navigate("/login/employee");
      } else if (role === "admin") {
        navigate("/login/hr");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Error setting password");
    }
  };

  return (
    <div className="create-password-wrapper">
      <div className="create-password-card">
        <h2 className="create-password-title">Create Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          className="create-password-input"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="create-password-button"
          onClick={handleSubmit}
        >
          Save Password
        </button>
      </div>
    </div>
  );
}

export default CreatePassword;
