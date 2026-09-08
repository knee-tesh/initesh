"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { resolveCommand } from "@/lib/command-palette";
import type { CommandResult } from "@/lib/command-palette";

const COMMANDS: { name: string; help: string }[] = [
  { name: "help", help: "show this list" },
  { name: "work", help: "go to work" },
  { name: "architecture", help: "go to architecture" },
  { name: "experience", help: "go to experience" },
  { name: "writing", help: "go to writing" },
  { name: "about", help: "go to about" },
  { name: "contact", help: "go to contact" },
  { name: "resume", help: "open resume" },
  { name: "whoami", help: "about the author" },
];

function CommandOutput({ result }: { result: CommandResult }) {
  if (result.kind === "output") {
    return (
      <div className="p-4 font-mono text-sm text-text space-y-1">
        {result.lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
    );
  }
  if (result.kind === "help") {
    return (
      <div className="p-4 font-mono text-sm space-y-1">
        {COMMANDS.map((c) => (
          <div key={c.name} className="flex gap-4">
            <span className="text-accent w-36">{c.name}</span>
            <span className="text-muted">{c.help}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="p-4 font-mono text-sm text-muted">
      Unknown command. Type &quot;help&quot; for available commands.
    </div>
  );
}

export default function CommandPalette({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  const filtered = useMemo(() => {
    const q = input.trim().toLowerCase();
    const list = q ? COMMANDS.filter((c) => c.name.includes(q)) : COMMANDS;
    if (selected >= list.length) setSelected(0);
    return list;
  }, [input, selected]);

  useEffect(() => {
    if (!open) return;
    setInput("");
    setSelected(0);
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[selected]?.name;
        if (!cmd) return;
        const result = resolveCommand(cmd);
        if (result.kind === "navigate") {
          onNavigateRef.current(result.href);
          onCloseRef.current();
        } else {
          setInput(cmd);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, selected]);

  if (!open) return null;

  const trimmed = input.trim();
  const result = trimmed ? resolveCommand(trimmed) : null;
  const showResult = result && (result.kind === "output" || result.kind === "help" || result.kind === "unknown");

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="border-b border-border px-4 py-3 flex items-center gap-2">
          <span className="font-mono text-accent text-sm">{">"}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command…"
            className="w-full bg-transparent font-mono text-text placeholder-muted outline-none"
          />
        </div>

        {showResult ? (
          <CommandOutput result={result} />
        ) : filtered.length > 0 ? (
          <ul className="max-h-64 overflow-y-auto py-1" role="listbox" aria-label="Commands">
            {filtered.map((c, i) => (
              <li key={c.name}>
                <button
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => {
                    const r = resolveCommand(c.name);
                    if (r.kind === "navigate") {
                      onNavigate(r.href);
                      onClose();
                    } else {
                      setInput(c.name);
                    }
                  }}
                  className={`w-full text-left px-4 py-2 flex items-center justify-between ${
                    i === selected ? "bg-elevated" : ""
                  }`}
                >
                  <span className={`font-mono text-sm ${i === selected ? "text-accent" : "text-text"}`}>
                    {c.name}
                  </span>
                  <span className="text-xs text-muted">{c.help}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
