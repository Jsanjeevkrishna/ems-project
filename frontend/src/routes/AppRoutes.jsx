import { Routes, Route, Navigate } from "react-router-dom";

/* ===== Auth ===== */
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import SelectRole from "../pages/SelectRole";
import CreatePassword from "../pages/auth/CreatePassword";

/* ===== Projects (shared) ===== */
import ProjectList from "../pages/projects/ProjectList";
import ProjectDetail from "../pages/projects/ProjectDetail";
import CreateProject from "../pages/projects/CreateProject";

/* ===== HR ===== */
import HRLogin from "../pages/hr/HRLogin";
import HRDashboard from "../pages/hr/HrDashboard";
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

/* ===== Guards ===== */
import RoleProtectedRoute from "./RoleProtectedRoute";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== Public ===== */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create-password" element={<CreatePassword />} />

      {/* Legacy role-specific login routes (kept for compatibility) */}
      <Route path="/login/hr" element={<HRLogin />} />
      <Route path="/login/manager" element={<ManagerLogin />} />
      <Route path="/login/employee" element={<EmployeeLogin />} />

      {/* ===== Projects (accessible to all authenticated users) ===== */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />

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
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/new" element={<CreateProject />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="teams" element={<div style={{padding:"32px",color:"#94a3b8"}}>Teams Page</div>} />
        <Route path="analytics" element={<div style={{padding:"32px",color:"#94a3b8"}}>Analytics Page</div>} />
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
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
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
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
