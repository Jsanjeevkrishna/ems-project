import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ allowedRole, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If not logged in → go to home
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If role doesn't match → go to home
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
