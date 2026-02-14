import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/ManagerPerformance.css";

export default function ManagerPerformance() {
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [individualPerformance, setIndividualPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamPerformance();
  }, []);

  const fetchTeamPerformance = async () => {
    try {
      const res = await axiosInstance.get("/manager/performance/team");
      setTeamPerformance(res.data);
    } catch (err) {
      console.error("Failed to load performance");
    } finally {
      setLoading(false);
    }
  };

  const fetchIndividualPerformance = async (employeeId) => {
    try {
      const res = await axiosInstance.get(
        `/manager/performance/employee/${employeeId}`
      );
      setSelectedEmployee(res.data.employee);
      setIndividualPerformance(res.data.performance);
    } catch (err) {
      console.error("Failed to load employee performance");
    }
  };

  if (loading) return <p>Loading performance...</p>;

  return (
    <div className="manager-performance-wrapper">
      <div className="manager-performance-card">
        <h2 className="manager-performance-title">
          Team Performance
        </h2>

        <table className="manager-performance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Total Tasks</th>
              <th>Completed</th>
              <th>Completion %</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {teamPerformance.length === 0 ? (
              <tr>
                <td colSpan="6">No performance data</td>
              </tr>
            ) : (
              teamPerformance.map((emp) => (
                <tr key={emp.employeeId}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.totalTasks}</td>
                  <td>{emp.completedTasks}</td>
                  <td
                    className={
                      emp.completionPercentage >= 50
                        ? "completion-high"
                        : "completion-low"
                    }
                  >
                    {emp.completionPercentage}%
                  </td>
                  <td>
                    <button
                      className="details-btn"
                      onClick={() =>
                        fetchIndividualPerformance(emp.employeeId)
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {selectedEmployee && individualPerformance && (
          <div className="individual-card">
            <h3>Individual Performance</h3>
            <p><strong>Name:</strong> {selectedEmployee.name}</p>
            <p><strong>Email:</strong> {selectedEmployee.email}</p>
            <p><strong>Total Tasks:</strong> {individualPerformance.totalTasks}</p>
            <p><strong>Completed Tasks:</strong> {individualPerformance.completedTasks}</p>
            <p>
              <strong>Completion Percentage:</strong>{" "}
              {individualPerformance.completionPercentage}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
