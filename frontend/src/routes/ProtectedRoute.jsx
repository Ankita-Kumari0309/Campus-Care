import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  // Not logged in
  if (!token) {
    // If user tried to access a dashboard, go back to home instead of login
    if (location.pathname.includes("dashboard")) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Role-based protection
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
