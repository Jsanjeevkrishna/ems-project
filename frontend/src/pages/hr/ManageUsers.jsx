import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee",
    managerId: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/hr/users");
      setUsers(res.data);

      const managerList = res.data.filter(
        (u) => u.role === "manager"
      );
      setManagers(managerList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = async () => {
    try {
      await axiosInstance.post("/hr/add-user", formData);
      fetchUsers();

      setFormData({
        name: "",
        email: "",
        role: "employee",
        managerId: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error adding user");
    }
  };

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/hr/delete-user/${id}`);
    fetchUsers();
  };

  const handlePromote = async (id) => {
    await axiosInstance.put(`/hr/promote/${id}`);
    fetchUsers();
  };

  return (
    <div className="manage-wrapper">
      <div className="manage-card">
        <h2 className="manage-title">Manage Users</h2>

        {/* ===== Add User Form ===== */}
        <div className="manage-form">
          <h3>Add User</h3>

          <div className="form-row">
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>

            {formData.role === "employee" && (
              <select
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
              >
                <option value="">Select Manager</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            )}

            <button className="add-btn" onClick={handleAddUser}>
              Add
            </button>
          </div>
        </div>

        {/* ===== Users Table ===== */}
        <div className="table-wrapper">
          <table className="manage-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.role === "employee" && (
                      <button
                        className="promote-btn"
                        onClick={() => handlePromote(user._id)}
                      >
                        Promote
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default ManageUsers;
