import { Navigate, Outlet } from "react-router-dom";
import { useAuth, Role } from "../auth/AuthContext";

export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { user, hasRole } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !hasRole(...roles)) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
