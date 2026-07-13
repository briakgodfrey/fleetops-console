import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function NavRail() {
  const { user, hasRole, logout } = useAuth();

  return (
    <nav className="nav-rail">
      <h2 style={{ fontSize: 20, marginBottom: 24 }}>FleetOps</h2>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/assets">Assets</NavLink>
      {hasRole("admin") && <NavLink to="/admin/users">Users</NavLink>}
      <div style={{ marginTop: 32, color: "var(--text-muted)", fontSize: 12 }}>
        {user?.name} · {user?.role}
      </div>
      <button onClick={logout} style={{ marginTop: 8, background: "none", border: "none", color: "var(--text-muted)", padding: 0 }}>
        Log out
      </button>
    </nav>
  );
}
