import { Navigate } from "react-router-dom";
import { getUser, dashboardPath } from "../api";

// Only lets a logged-in user with one of the allowed roles through
const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const user = getUser();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={dashboardPath(user.role)} replace />;
  }
  return children;
};

export default ProtectedRoute;
