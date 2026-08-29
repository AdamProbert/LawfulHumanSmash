/** Small presentational pieces shared by the admin tabs. */

export function Pill({
  status,
  children,
}: {
  status: "yes" | "no" | "pending" | "neutral";
  children: React.ReactNode;
}) {
  return (
    <span className="admin-pill" data-status={status}>
      {children}
    </span>
  );
}

export function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="admin-stat">
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-label">{label}</div>
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-sm text-bark-light text-center py-8">
      {children}
    </p>
  );
}

/** "12 Mar 2026, 14:05", or a dash when there is no date. */
export function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
