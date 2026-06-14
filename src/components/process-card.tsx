import Link from "next/link";
import type { Process } from "@/lib/types";

export default function ProcessCard({
  process,
  children,
  defaultExpanded = false,
}: {
  process: Process;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  const statusColor =
    process.status === "running"
      ? "status-dot-running"
      : process.status === "idle"
        ? "status-dot-idle"
        : "status-dot-sleeping";

  return (
    <Link
      href={process.href}
      className="process-card keyboard-nav block p-4 rounded-sm"
      aria-expanded={defaultExpanded}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            PID {process.pid}
          </span>
          <span className={statusColor} aria-hidden="true">
            ●
          </span>
          <span className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            {process.status}
          </span>
        </div>
        <span className="chevron text-xs transition-transform" style={{ color: "var(--muted)" }}>
          ▶
        </span>
      </div>
      <h3 className="text-base font-semibold mb-1" style={{ color: "var(--fg)" }}>
        {process.name}
      </h3>
      {children && (
        <div className="text-sm" style={{ color: "var(--muted)" }}>
          {children}
        </div>
      )}
    </Link>
  );
}
