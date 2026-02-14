import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/employeeLeaves.css";

export default function EmployeeLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchLeaves = async () => {
    try {
      const res = await axiosInstance.get("/employee/leaves");
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async () => {
    if (!fromDate || !toDate || !reason) {
      setMessage("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/employee/leaves", {
        fromDate,
        toDate,
        reason,
      });

      setMessage("Leave applied successfully");
      setFromDate("");
      setToDate("");
      setReason("");
      fetchLeaves();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leaves-container">

      {/* ===== APPLY LEAVE CARD ===== */}
      <div className="leave-form-card">
        <h2>Apply Leave</h2>

        <div className="leave-form">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <button
          className="apply-btn"
          onClick={handleApplyLeave}
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply Leave"}
        </button>

        {message && <p className="leave-message">{message}</p>}
      </div>

      {/* ===== LEAVE LIST ===== */}
      <div className="leave-list">
        <h2>My Leaves</h2>

        {leaves.length === 0 && <p>No leave records</p>}

        {leaves.map((leave) => (
          <div key={leave._id} className="leave-card">
            <div>
              <strong>
                {new Date(leave.fromDate).toLocaleDateString()} →{" "}
                {new Date(leave.toDate).toLocaleDateString()}
              </strong>
              <p className="leave-reason">{leave.reason}</p>
            </div>

            <span
              className={
                leave.status === "approved"
                  ? "status-approved"
                  : leave.status === "rejected"
                  ? "status-rejected"
                  : "status-pending"
              }
            >
              {leave.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
