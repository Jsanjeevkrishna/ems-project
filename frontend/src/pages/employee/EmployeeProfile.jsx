import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/EmployeeProfile.css";

export default function EmployeeProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/employee/profile")
      .then(res => setProfile(res.data))
      .catch(console.error);
  }, []);

  if (!profile) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <div className="profile-container">
      
      <div className="profile-title">
        My Profile
      </div>

      <div className="profile-card">
        <span className="profile-label">Name:</span>
        {profile.name}
      </div>

      <div className="profile-card">
        <span className="profile-label">Email:</span>
        {profile.email}
      </div>

      <div className="profile-card">
        <span className="profile-label">Role:</span>
        {profile.role}
      </div>

    </div>
  );
}
