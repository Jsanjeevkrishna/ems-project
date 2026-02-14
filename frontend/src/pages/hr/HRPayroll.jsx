import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./css/HRPayroll.css";

function HRPayroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    salary: "",
    month: "",
  });

  // Fetch employees (from Manage Users API)
  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/hr/users");
      const onlyEmployees = res.data.filter(
        (u) => u.role === "employee"
      );
      setEmployees(onlyEmployees);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch payroll records
  const fetchPayrolls = async () => {
    try {
      const res = await axiosInstance.get("/hr/payroll/all");
      setPayrolls(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchPayrolls();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post("/hr/payroll/save", formData);
      fetchPayrolls();

      setFormData({
        employeeId: "",
        salary: "",
        month: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error saving payroll");
    }
  };

  const handleMarkPaid = async (id) => {
    await axiosInstance.put(`/hr/payroll/pay/${id}`);
    fetchPayrolls();
  };

  return (
  <div className="payroll-wrapper">
    <div className="payroll-card">
      <h2 className="payroll-title">Payroll Management</h2>

      {/* ===== FORM SECTION ===== */}
      <div className="payroll-form-section">
        <h3>Create / Update Payroll</h3>

        <div className="payroll-form">
          <select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>

          <input
            name="salary"
            type="number"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
          />

          <input
            name="month"
            type="month"
            value={formData.month}
            onChange={handleChange}
          />

          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="payroll-table-wrapper">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Month</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {payrolls.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No payroll records
                </td>
              </tr>
            ) : (
              payrolls.map((p) => (
                <tr key={p._id}>
                  <td>{p.employeeId?.name}</td>
                  <td>{p.employeeId?.email}</td>
                  <td>{p.month}</td>
                  <td>₹ {p.salary}</td>
                  <td>
                    <span className={`status-badge ${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    {p.status === "pending" && (
                      <button
                        className="mark-paid-btn"
                        onClick={() => handleMarkPaid(p._id)}
                      >
                        Mark Paid
                      </button>
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

export default HRPayroll;
