import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import { NavRail } from "../components/NavRail";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../auth/AuthContext";

interface Asset {
  _id: string;
  referenceCode: string;
  type: string;
  origin: string;
  destination: string;
  status: "pending" | "in_transit" | "delayed" | "delivered" | "exception";
  updatedAt: string;
}

interface AssetListResponse {
  items: Asset[];
  total: number;
  page: number;
  pages: number;
}

export default function Assets() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { hasRole } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["assets", search, status, page],
    queryFn: () =>
      apiFetch<AssetListResponse>(
        `/assets?search=${encodeURIComponent(search)}&status=${status}&page=${page}&limit=20`
      ),
  });

  return (
    <div className="app-shell">
      <NavRail />
      <main style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Assets</h1>
          {hasRole("operator", "admin") && (
            <button
              style={{
                background: "var(--accent-signal)",
                border: "none",
                borderRadius: 4,
                padding: "8px 16px",
                fontWeight: 600,
                color: "var(--bg-base)",
              }}
            >
              + New Asset
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input
            placeholder="Search reference code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{
              flex: 1,
              padding: "8px 10px",
              background: "var(--bg-panel)",
              border: "1px solid var(--border-hairline)",
              borderRadius: 4,
              color: "var(--text-primary)",
            }}
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "8px 10px",
              background: "var(--bg-panel)",
              border: "1px solid var(--border-hairline)",
              borderRadius: 4,
              color: "var(--text-primary)",
            }}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_transit">In transit</option>
            <option value="delayed">Delayed</option>
            <option value="delivered">Delivered</option>
            <option value="exception">Exception</option>
          </select>
        </div>

        <div className="panel">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Status</th>
                <th>Route</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5}>Loading...</td>
                </tr>
              )}
              {data?.items.map((asset) => (
                <tr key={asset._id}>
                  <td className="mono">
                    <Link to={`/assets/${asset._id}`}>{asset.referenceCode}</Link>
                  </td>
                  <td>{asset.type}</td>
                  <td>
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="mono">
                    {asset.origin} → {asset.destination}
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                    {new Date(asset.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data && data.pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16 }}>
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Prev
              </button>
              <span style={{ color: "var(--text-muted)" }}>
                Page {data.page} of {data.pages}
              </span>
              <button disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
