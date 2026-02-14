import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/HRPerformance.css";

function HRPerformance() {
  const [managers, setManagers] = useState([]);
  const [expandedManager, setExpandedManager] = useState(null);

  const fetchPerformance = async () => {
    try {
      const res = await axiosInstance.get("/hr/performance/managers");
      setManagers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const calculatePercentage = (total, completed) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

 return (
  <div className="performance-wrapper">
    <div className="performance-card">
      <h2 className="performance-title">Performance Monitoring</h2>

      <table className="performance-table">
        <thead>
          <tr>
            <th>Manager</th>
            <th>Total Tasks</th>
            <th>Completed</th>
            <th>Completion</th>
            <th>Team</th>
          </tr>
        </thead>

        <tbody>
          {managers.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                No data available
              </td>
            </tr>
          ) : (
            managers.map((manager) => {
              const percentage = calculatePercentage(
                manager.totalTasks,
                manager.completedTasks
              );

              return (
                <>
                  <tr key={manager.managerId}>
                    <td>{manager.name}</td>
                    <td>{manager.totalTasks}</td>
                    <td>{manager.completedTasks}</td>

                    <td>
                      <div className="progress-container">
                        <div
                          className="progress-bar"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage}%
                        </div>
                      </div>
                    </td>

                    <td>
                      <button
                        className="team-btn"
                        onClick={() =>
                          setExpandedManager(
                            expandedManager === manager.managerId
                              ? null
                              : manager.managerId
                          )
                        }
                      >
                        {expandedManager === manager.managerId
                          ? "Hide Team"
                          : "View Team"}
                      </button>
                    </td>
                  </tr>

                  {expandedManager === manager.managerId && (
                    <tr className="team-row">
                      <td colSpan="5">
                        <div className="team-section">
                          <h4>Team Performance</h4>

                          <table className="team-table">
                            <thead>
                              <tr>
                                <th>Employee</th>
                                <th>Total</th>
                                <th>Completed</th>
                                <th>Completion</th>
                              </tr>
                            </thead>

                            <tbody>
                              {manager.team.length === 0 ? (
                                <tr>
                                  <td colSpan="4">
                                    No employees under this manager
                                  </td>
                                </tr>
                              ) : (
                                manager.team.map((emp) => {
                                  const empPercentage =
                                    calculatePercentage(
                                      emp.totalTasks,
                                      emp.completedTasks
                                    );

                                  return (
                                    <tr key={emp.employeeId}>
                                      <td>{emp.name}</td>
                                      <td>{emp.totalTasks}</td>
                                      <td>{emp.completedTasks}</td>
                                      <td>
                                        <div className="progress-container small">
                                          <div
                                            className="progress-bar"
                                            style={{
                                              width: `${empPercentage}%`,
                                            }}
                                          >
                                            {empPercentage}%
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);

}

export default HRPerformance;
