import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/ManagerTasks.css";

export default function ManagerTasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  // Fetch manager's tasks
  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/manager/tasks");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch manager team members
  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/manager/tasks/team");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to load employees");
    }
  };

  // Create new task
  const handleCreateTask = async () => {
    if (!title || !employeeId) {
      alert("Please enter title and select employee");
      return;
    }

    try {
      await axiosInstance.post("/manager/tasks/create", {
        title,
        description,
        employeeId,
      });

      setTitle("");
      setDescription("");
      setEmployeeId("");

      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

return (
  <div className="tasks-wrapper">
    <h2>Manager Tasks</h2>

    {/* Create Task Section */}
    <div className="create-task-card">
      <h3>Create Task</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      >
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.name}
          </option>
        ))}
      </select>

      <button onClick={handleCreateTask}>Assign Task</button>
    </div>

    {/* Task List */}
    <h3>Assigned Tasks</h3>

    <table className="tasks-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Employee</th>
          <th>Status</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {tasks.length === 0 ? (
          <tr>
            <td colSpan="5">No tasks found</td>
          </tr>
        ) : (
          tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.employeeId?.name}</td>
              <td
                className={
                  task.status === "completed"
                    ? "status-completed"
                    : "status-pending"
                }
              >
                {task.status}
              </td>
              <td>
                {new Date(task.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

}
