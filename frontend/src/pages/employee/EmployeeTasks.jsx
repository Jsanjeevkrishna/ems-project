import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/employeeTasks.css";

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/employee/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (taskId, status) => {
    try {
      await axiosInstance.patch(`/employee/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (err) {
      alert("Failed to update task");
    }
  };

  return (
    <div className="tasks-container">
      <h2>My Tasks</h2>

      {tasks.length === 0 && <p>No tasks assigned</p>}

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task._id} className="task-card">

            <div className="task-left">
              <h3>{task.title}</h3>
              <span
                className={`task-status ${task.status}`}
              >
                {task.status}
              </span>
            </div>

            <div className="task-right">
              <select
                value={task.status}
                onChange={(e) =>
                  updateStatus(task._id, e.target.value)
                }
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
