import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/ManagerLeaves.css";

export default function ManagerLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axiosInstance.get("/manager/leaves/team");
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async (id) => {
    await axiosInstance.put(`/manager/leaves/approve/${id}`);
    fetchLeaves();
  };

  const forwardLeave = async (id) => {
    await axiosInstance.put(`/manager/leaves/forward/${id}`);
    fetchLeaves();
  };

  if (loading) return <p>Loading leaves...</p>;

  return (
    <div className="manager-leaves-wrapper">
      <div className="manager-leaves-card">
        <h2 className="manager-leaves-title">
          Team Leave Requests
        </h2>

        <table className="manager-leaves-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
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
                  No leave requests found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.userId?.name}</td>
                  <td>{leave.userId?.email}</td>
                  <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td className={`status-${leave.managerStatus}`}>
                    {leave.managerStatus}
                  </td>
                  <td>
                    <button
                      className="action-btn approve-btn"
                      onClick={() => approveLeave(leave._id)}
                    >
                      Approve
                    </button>

                    <button
                      className="action-btn forward-btn"
                      onClick={() => forwardLeave(leave._id)}
                    >
                      Forward
                    </button>
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
