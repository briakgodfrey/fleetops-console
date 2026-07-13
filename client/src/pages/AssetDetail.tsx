import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import { NavRail } from "../components/NavRail";
import { StatusBadge } from "../components/StatusBadge";

interface AuditEntry {
  _id: string;
  action: string;
  before?: { status?: string };
  after?: { status?: string };
  note?: string;
  timestamp: string;
}

interface AssetDetailResponse {
  asset: {
    _id: string;
    referenceCode: string;
    type: string;
    origin: string;
    destination: string;
    status: "pending" | "in_transit" | "delayed" | "delivered" | "exception";
  };
  history: AuditEntry[];
}

export default function AssetDetail() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => apiFetch<AssetDetailResponse>(`/assets/${id}`),
  });

  if (!data) return null;
  const { asset, history } = data;

  return (
    <div className="app-shell">
      <NavRail />
      <main style={{ padding: 32 }}>
        <Link to="/assets" style={{ fontSize: 13, color: "var(--text-muted)" }}>
          ← Back to Assets
        </Link>
        <h1 className="mono" style={{ fontSize: 28, margin: "8px 0 24px" }}>
          {asset.referenceCode}
        </h1>

        <div className="panel" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 32, marginBottom: 16 }}>
            <div>
              <div className="metric-label">Type</div>
              <div>{asset.type}</div>
            </div>
            <div>
              <div className="metric-label">Route</div>
              <div className="mono">
                {asset.origin} → {asset.destination}
              </div>
            </div>
            <div>
              <div className="metric-label">Status</div>
              <StatusBadge status={asset.status} current />
            </div>
          </div>
        </div>

        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Status Timeline</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {history.map((entry, i) => (
              <div key={entry._id} style={{ display: "flex", gap: 16, alignItems: "center", padding: "8px 0" }}>
                <span className="mono" style={{ fontSize: 12, color: "var(--text-muted)", width: 140 }}>
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
                <span style={{ fontSize: 13 }}>
                  {entry.action === "created" ? (
                    "Asset created"
                  ) : (
                    <>
                      {entry.before?.status} → <StatusBadge status={(entry.after?.status as any) ?? asset.status} current={i === history.length - 1} />
                    </>
                  )}
                </span>
                {entry.note && <span style={{ color: "var(--text-muted)", fontSize: 12 }}>"{entry.note}"</span>}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
