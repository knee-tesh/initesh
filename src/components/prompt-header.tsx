'use client';

import { useEffect, useState } from "react";
import type { Palette, Theme } from "@/lib/types";

const PALETTE_LABELS: Record<Palette, string> = {
  dawn: "DAWN",
  day: "DAY",
  dusk: "DUSK",
  midnight: "MIDNIGHT",
};

export default function PromptHeader({
  palette,
  theme,
  onCmdK,
}: {
  palette: Palette;
  theme: Theme;
  onCmdK: () => void;
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b px-4 py-2 flex items-center justify-between text-sm"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: "var(--muted)" }}>nitesh</span>
        <span style={{ color: "var(--muted)" }}>@</span>
        <span style={{ color: "var(--accent)" }}>portfolio</span>
        <span style={{ color: "var(--muted)" }}>:</span>
        <span style={{ color: "var(--fg)" }}>~$</span>
        <span className="cursor-blink" style={{ color: "var(--fg)" }} />
        <span className="ml-2 text-xs" style={{ color: "var(--muted)" }}>
          [{PALETTE_LABELS[palette]}]
        </span>
        <span className="text-xs" style={{ color: "var(--accent)" }}>
          [{theme.toUpperCase()}]
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span style={{ color: "var(--muted)" }}>{time}</span>
        <button
          onClick={onCmdK}
          title="Open command palette"
          aria-label="Command palette"
          className="keyboard-nav px-2 py-0.5 rounded text-xs border"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          type="button"
        >
          ⌘K
        </button>
      </div>
    </header>
  );
}
