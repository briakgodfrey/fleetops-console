import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import { NavRail } from "../components/NavRail";
import { useAuth } from "../auth/AuthContext";

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  createdAt: string;
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiFetch<UserRow[]>("/users"),
  });

  const { mutate: changeRole, isPending, variables, error } = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      apiFetch<UserRow>(`/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <div className="app-shell">
      <NavRail />
      <main style={{ padding: 32 }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Users</h1>

        {error && (
          <div className="panel" style={{ marginBottom: 16, color: "var(--accent-critical)" }}>
            {error instanceof Error ? error.message : "Failed to update role"}
          </div>
        )}

        <div className="panel">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4}>Loading...</td>
                </tr>
              )}
              {users?.map((u) => (
                <tr key={u._id}>
                  <td>
                    {u.name}
                    {u._id === currentUser?.id && (
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}> (you)</span>
                    )}
                  </td>
                  <td className="mono" style={{ fontSize: 13 }}>
                    {u.email}
                  </td>
                  <td>
                    <select
                      value={u.role}
                      disabled={isPending && variables?.id === u._id}
                      onChange={(e) => changeRole({ id: u._id, role: e.target.value })}
                      style={{
                        background: "var(--bg-base)",
                        border: "1px solid var(--border-hairline)",
                        borderRadius: 4,
                        color: "var(--text-primary)",
                        padding: "4px 8px",
                      }}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="operator">Operator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
