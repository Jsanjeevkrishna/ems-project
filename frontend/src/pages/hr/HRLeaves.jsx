import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/HRLeaves.css";

function HRLeaves() {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const res = await axiosInstance.get("/hr/leaves/all");
      setLeaves(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/hr/leaves/update/${id}`, { status });
      fetchLeaves();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

return (
  <div className="leaves-wrapper">
    <div className="leaves-card">
      <h2 className="leaves-title">Leave Management</h2>

      <div className="leaves-table-wrapper">
        <table className="leaves-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No leave requests
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.userId?.name}</td>
                  <td>{leave.role}</td>
                  <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`status-badge ${leave.status}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    {leave.status === "pending" && (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            updateStatus(leave._id, "approved")
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            updateStatus(leave._id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}
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

export default HRLeaves;
