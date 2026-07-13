type Status = "pending" | "in_transit" | "delayed" | "delivered" | "exception";

export function StatusBadge({ status, current = false }: { status: Status; current?: boolean }) {
  const label = status.replace("_", " ");
  return <span className={`status-badge status-${status} ${current ? "current" : ""}`}>{label}</span>;
}
