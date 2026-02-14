import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/HRSearch.css";

function HRSearch() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("all");

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(
        `/hr/search?keyword=${keyword}&role=${role}`
      );
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [keyword, role]);

 return (
  <div className="search-wrapper">
    <div className="search-card">
      <h2 className="search-title">
        Search Employees & Managers
      </h2>

      {/* ===== Filters ===== */}
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by name or email"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="all">All</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      {/* ===== Table ===== */}
      <table className="search-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Manager</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-data">
                No results found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>

                <td>
                  <span
                    className={`role-badge ${user.role}`}
                  >
                    {user.role}
                  </span>
                </td>

                <td>
                  {user.managerId
                    ? user.managerId.name
                    : "-"}
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

export default HRSearch;
