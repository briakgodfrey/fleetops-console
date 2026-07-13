import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("operator@fleetops.dev");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await apiFetch<{ accessToken: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(res.user, res.accessToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <form onSubmit={handleSubmit} className="panel" style={{ width: 340 }}>
        <h1 style={{ fontSize: 28, marginBottom: 4 }}>FleetOps Console</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 0, marginBottom: 24, fontSize: 13 }}>
          Sign in to view fleet status.
        </p>
        {error && (
          <div style={{ color: "var(--accent-critical)", marginBottom: 16, fontSize: 13 }}>{error}</div>
        )}
        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={{ display: "block", marginBottom: 4, fontSize: 12, color: "var(--text-muted)" }}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </label>
        <label style={{ display: "block", marginBottom: 20 }}>
          <span style={{ display: "block", marginBottom: 4, fontSize: 12, color: "var(--text-muted)" }}>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </label>
        <button type="submit" style={buttonStyle}>
          Sign in
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  background: "var(--bg-base)",
  border: "1px solid var(--border-hairline)",
  borderRadius: 4,
  color: "var(--text-primary)",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  background: "var(--accent-signal)",
  border: "none",
  borderRadius: 4,
  color: "var(--bg-base)",
  fontWeight: 600,
};
