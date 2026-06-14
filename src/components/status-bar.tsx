'use client';

import type { Palette, Theme } from "@/lib/types";

export default function StatusBar({
  uptime,
  cronLog,
  palette,
  theme,
  processJitter,
}: {
  uptime: string;
  cronLog: string;
  palette: Palette;
  theme: Theme;
  processJitter: boolean;
}) {
  return (
    <footer
      className={`sticky bottom-0 z-50 border-t px-4 py-1.5 text-xs flex items-center justify-between ${processJitter ? "animate-pulse" : ""}`}
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
    >
      <div className="flex items-center gap-3">
        <span style={{ color: "var(--muted)" }}>PID: 1</span>
        <span style={{ color: "var(--muted)" }}>|</span>
        <span style={{ color: "var(--muted)" }}>{uptime}</span>
      </div>
      <div className="flex items-center gap-3" aria-live="polite" aria-atomic="true">
        {cronLog && (
          <span style={{ color: "var(--accent)" }} className="hidden sm:inline">
            {cronLog}
          </span>
        )}
        <span className="flex items-center gap-1">
          <span
            className={
              palette === "midnight"
                ? "status-dot-sleeping"
                : "status-dot-running"
            }
            aria-hidden="true"
          >
            ●
          </span>
          <span style={{ color: "var(--muted)" }}>
            {palette.toUpperCase()}
          </span>
        </span>
        <span style={{ color: theme === "retrowave" ? "var(--accent)" : "var(--muted)" }}>
          {theme === "retrowave" ? "⚡" : "≡"}
        </span>
      </div>
    </footer>
  );
}
