import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/ManagerAttendance.css";

export default function ManagerAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [teamSize, setTeamSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axiosInstance.get(
          "/manager/attendance/team"
        );

        setAttendance(res.data.attendance);
        setTeamSize(res.data.teamSize);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load attendance");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) return <p>Loading attendance...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
return (
  <div className="manager-attendance-wrapper">
    <h2 className="manager-attendance-title">Team Attendance</h2>
    <p className="manager-team-count">
      Total Team Members: {teamSize}
    </p>

    <div className="manager-table-card">
      <table className="manager-attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {attendance.length === 0 ? (
            <tr>
              <td colSpan="4">No attendance records found</td>
            </tr>
          ) : (
            attendance.map((record) => (
              <tr key={record._id}>
                <td>{record.userId?.name}</td>
                <td>{record.userId?.email}</td>
                <td>
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td
                  className={
                    record.status === "present"
                      ? "status-present"
                      : "status-absent"
                  }
                >
                  {record.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

}
