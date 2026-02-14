import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/employeeAttendance.css";

export default function EmployeeAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchAttendance = async () => {
    try {
      const res = await axiosInstance.get("/employee/attendance");
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    try {
      const res = await axiosInstance.post("/employee/attendance/mark");
      setMessage(res.data.message);
      fetchAttendance();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error marking attendance");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) return <p>Loading attendance...</p>;

  return (
    <div className="attendance-container">
      <h2>My Attendance</h2>

      <button className="mark-btn" onClick={markAttendance}>
        Mark Today’s Attendance
      </button>

      {message && <p className="attendance-message">{message}</p>}

      <div className="attendance-list">
        {attendance.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          attendance.map((a, i) => (
            <div key={i} className="attendance-card">
              <span>
                {new Date(a.date).toLocaleDateString()}
              </span>
              <span
                className={
                  a.status === "present"
                    ? "status-present"
                    : "status-absent"
                }
              >
                {a.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
