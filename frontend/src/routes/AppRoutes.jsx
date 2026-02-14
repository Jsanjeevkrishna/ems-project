import { Routes, Route, Navigate } from "react-router-dom";

import SelectRole from "../pages/SelectRole";

/* ===== HR ===== */
import HRLogin from "../pages/hr/HRLogin";
import HRDashboard from "../pages/hr/HRDashboard";
import HRLayout from "../pages/hr/HRLayout";
import ManageUsers from "../pages/hr/ManageUsers";
import HRAttendance from "../pages/hr/HRAttendance";
import HRLeaves from "../pages/hr/HRLeaves";
import HRPayroll from "../pages/hr/HRPayroll";
import HRPerformance from "../pages/hr/HRPerformance";
import HRSearch from "../pages/hr/HRSearch";

/* ===== Manager ===== */
import ManagerLogin from "../pages/manager/ManagerLogin";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerLayout from "../pages/manager/ManagerLayout";
import ManagerAttendance from "../pages/manager/ManagerAttendance";
import ManagerLeaves from "../pages/manager/ManagerLeaves";
import ManagerTasks from "../pages/manager/ManagerTasks";
import ManagerPerformance from "../pages/manager/ManagerPerformance";
import ManagerProfile from "../pages/manager/ManagerProfile";
import ManagerTeamChat from "../pages/manager/ManagerTeamChat";

/* ===== Employee ===== */
import EmployeeLogin from "../pages/employee/EmployeeLogin";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeLayout from "../pages/employee/EmployeeLayout";
import EmployeeTasks from "../pages/employee/EmployeeTasks";
import EmployeeAttendance from "../pages/employee/EmployeeAttendance";
import EmployeeLeaves from "../pages/employee/EmployeeLeaves";
import EmployeeProfile from "../pages/employee/EmployeeProfile";
import EmployeePerformance from "../pages/employee/EmployeePerformance";
import EmployeeNotifications from "../pages/employee/EmployeeNotifications";
import EmployeeChat from "../pages/employee/EmployeeChat";

/* ===== Common ===== */
import RoleProtectedRoute from "./RoleProtectedRoute";
import CreatePassword from "../pages/auth/CreatePassword";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== Public ===== */}
      <Route path="/" element={<SelectRole />} />

      {/* ===== Login Pages ===== */}
      <Route path="/login/hr" element={<HRLogin />} />
      <Route path="/login/manager" element={<ManagerLogin />} />
      <Route path="/login/employee" element={<EmployeeLogin />} />
      <Route path="/create-password" element={<CreatePassword />} />

      {/* ===== HR Protected Layout ===== */}
      <Route
        path="/hr"
        element={
          <RoleProtectedRoute allowedRole="admin">
            <HRLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<HRDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="attendance" element={<HRAttendance />} />
        <Route path="leaves" element={<HRLeaves />} />
        <Route path="payroll" element={<HRPayroll />} />
        <Route path="performance" element={<HRPerformance />} />
        <Route path="search" element={<HRSearch />} />
        <Route path="teams" element={<div>Teams Page</div>} />
        <Route path="analytics" element={<div>Analytics Page</div>} />
      </Route>

      {/* ===== Manager Protected Layout ===== */}
      <Route
        path="/manager"
        element={
          <RoleProtectedRoute allowedRole="manager">
            <ManagerLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="attendance" element={<ManagerAttendance />} />
        <Route path="leaves" element={<ManagerLeaves />} />
        <Route path="performance" element={<ManagerPerformance />} />
        <Route path="tasks" element={<ManagerTasks />} />
        <Route path="profile" element={<ManagerProfile />} />
        <Route path="team-chat" element={<ManagerTeamChat />} />
      </Route>

      {/* ===== Employee Protected Layout ===== */}
      <Route
        path="/employee"
        element={
          <RoleProtectedRoute allowedRole="employee">
            <EmployeeLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route path="tasks" element={<EmployeeTasks />} />
        <Route path="leaves" element={<EmployeeLeaves />} />
        <Route path="performance" element={<EmployeePerformance />} />
        <Route path="notifications" element={<EmployeeNotifications />} />
        <Route path="chat" element={<EmployeeChat />} />
        <Route path="profile" element={<EmployeeProfile />} />
      </Route>
    </Routes>
  );
}
