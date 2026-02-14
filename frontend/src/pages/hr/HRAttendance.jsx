import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/HRAttendance.css";

function HRAttendance() {
  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
  });

  const [attendance, setAttendance] = useState([]);

  const fetchSummary = async () => {
    try {
      const res = await axiosInstance.get(
        "/hr/attendance/summary/today"
      );
      setSummary(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axiosInstance.get(
        "/hr/attendance/today"
      );
      setAttendance(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchAttendance();
  }, []);

  const total = summary.present + summary.absent;
  const presentPercent = total
    ? Math.round((summary.present / total) * 100)
    : 0;
  const absentPercent = total
    ? Math.round((summary.absent / total) * 100)
    : 0;

  return (
    <div className="attendance-wrapper">
      <div className="attendance-card">

        <h2 className="attendance-title">HR Attendance</h2>

        {/* ===== Summary Cards ===== */}
        <div className="attendance-summary">

          <div className="summary-box present">
            <h3>Present</h3>
            <p>{summary.present}</p>
            <span>{presentPercent}%</span>
          </div>

          <div className="summary-box absent">
            <h3>Absent</h3>
            <p>{summary.absent}</p>
            <span>{absentPercent}%</span>
          </div>

        </div>

        {/* ===== Simple Graph ===== */}
       {/* ===== Circular Graph ===== */}
<div className="circle-graph-section">
  <h3>Attendance Overview</h3>

  <div className="circle-wrapper">

    {/* Present Circle */}
    <div
      className="circle"
      style={{
        background: `conic-gradient(
          #22c55e ${presentPercent}%,
          #1e3a8a ${presentPercent}% 100%
        )`,
      }}
    >
      <div className="circle-inner">
        <span>{presentPercent}%</span>
        <small>Present</small>
      </div>
    </div>

    {/* Absent Circle */}
    <div
      className="circle"
      style={{
        background: `conic-gradient(
          #ef4444 ${absentPercent}%,
          #1e3a8a ${absentPercent}% 100%
        )`,
      }}
    >
      <div className="circle-inner">
        <span>{absentPercent}%</span>
        <small>Absent</small>
      </div>
    </div>

  </div>
</div>


        {/* ===== Table ===== */}
        <div className="attendance-table-wrapper">
          <h3>Today's Attendance</h3>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="3">No records found</td>
                </tr>
              ) : (
                attendance.map((record) => (
                  <tr key={record._id}>
                    <td>{record.name}</td>
                    <td>{record.role}</td>
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
    </div>
  );
}

export default HRAttendance;
