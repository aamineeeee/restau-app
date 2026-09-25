import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const roleHome = {
  client: "/menu",
  staff: "/staff",
  admin: "/admin/menu",
};

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={roleHome[user.role] ?? "/login"} replace />;
  }

  return children ?? <Outlet />;
}