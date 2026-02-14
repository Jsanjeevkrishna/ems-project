import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/ManagerProfile.css";

export default function ManagerProfile() {
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState("");
  const [place, setPlace] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/manager/profile/me");
      setProfile(res.data);
      setPhone(res.data.phone || "");
      setPlace(res.data.place || "");
      setGender(res.data.gender || "");
    } catch (err) {
      console.error("Failed to load profile");
    }
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.put("/manager/profile/complete-profile", {
        phone,
        place,
        gender,
      });

      alert("Profile updated successfully");
      fetchProfile();
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">

        <div className="profile-avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>

        <h2>{profile.name}</h2>
        <p className="profile-email">{profile.email}</p>

        <div className="profile-details">
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            placeholder="Place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button onClick={handleUpdate}>
            Update Profile
          </button>
        </div>

      </div>
    </div>
  );
}
