import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { apiFetch } from "../api/client";
import { NavRail } from "../components/NavRail";
import { Link } from "react-router-dom";

interface StatusCounts {
  pending: number;
  in_transit: number;
  delayed: number;
  delivered: number;
  exception: number;
}

interface ActivityItem {
  _id: string;
  action: string;
  timestamp: string;
  note?: string;
  actorId: { name: string };
  assetId: { referenceCode: string };
}

const COLORS: Record<string, string> = {
  pending: "#8fa3ad",
  in_transit: "#4fa8a0",
  delayed: "#f2a93b",
  delivered: "#2f7a73",
  exception: "#e4572e",
};

export default function Dashboard() {
  const { data: counts } = useQuery({
    queryKey: ["status-counts"],
    queryFn: () => apiFetch<StatusCounts>("/dashboard/status-counts"),
  });

  const { data: activity } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: () => apiFetch<ActivityItem[]>("/dashboard/recent-activity"),
  });

  const chartData = counts
    ? Object.entries(counts).map(([status, count]) => ({ name: status, value: count }))
    : [];

  return (
    <div className="app-shell">
      <NavRail />
      <main style={{ padding: 32 }}>
        <h1 style={{ fontSize: 28, marginBottom: 20 }}>Status Overview</h1>

        <div className="metric-grid">
          {counts &&
            Object.entries(counts).map(([status, count]) => (
              <div className="metric-card" key={status}>
                <div className="metric-value" style={{ color: COLORS[status] }}>
                  {count}
                </div>
                <div className="metric-label">{status.replace("_", " ")}</div>
              </div>
            ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-panel-raised)", border: "none" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
            <table>
              <tbody>
                {activity?.map((item) => (
                  <tr key={item._id}>
                    <td className="mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {item.actorId?.name} {item.action.replace("_", " ")}{" "}
                      <Link to={`/assets/${item.assetId}`} className="mono">
                        {item.assetId?.referenceCode}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
