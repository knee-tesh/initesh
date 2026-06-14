'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Theme } from "@/lib/types";

interface Command {
  id: string;
  label: string;
  action: () => void;
}

export default function CommandPalette({
  open,
  onClose,
  theme,
  onToggleTheme,
  email,
}: {
  open: boolean;
  onClose: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  email: string;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: Command[] = [
    { id: "home", label: "Go to Home", action: () => router.push("/") },
    { id: "skills", label: "View Skills", action: () => router.push("/skills") },
    { id: "services", label: "View Services", action: () => router.push("/services") },
    { id: "about", label: "About Me", action: () => router.push("/about") },
    { id: "contact", label: "Contact", action: () => router.push("/contact") },
    {
      id: "theme",
      label: theme === "terminal" ? "Switch to Retrowave" : "Switch to Terminal",
      action: () => { onToggleTheme(); onClose(); },
    },
    { id: "email", label: "Copy Email", action: () => {
      navigator.clipboard.writeText(email);
      onClose();
    }},
    { id: "admin", label: "Admin Dashboard", action: () => router.push("/admin") },
  ];

  const close = useCallback(() => {
    onClose();
    setQuery("");
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filtered = query
    ? commands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const handleSelect = (cmd: Command) => {
    cmd.action();
    close();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-start justify-center pt-[20vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="fixed inset-0 bg-black/60" onClick={close} />
      <div
        className="relative w-full max-w-md border rounded-sm shadow-2xl"
        style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command..."
          className="keyboard-nav w-full px-4 py-3 text-sm border-b outline-none bg-transparent"
          style={{ color: "var(--fg)", borderColor: "var(--border)" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filtered.length > 0) {
              handleSelect(filtered[0]);
            }
          }}
        />
        <ul className="max-h-60 overflow-y-auto py-1" role="listbox">
          {filtered.map((cmd) => (
            <li key={cmd.id} role="option" aria-selected={false}>
              <button
                onClick={() => handleSelect(cmd)}
                className="keyboard-nav w-full text-left px-4 py-2 text-sm hover:opacity-80 transition-opacity"
                style={{ color: "var(--fg)" }}
                type="button"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--fg)";
                }}
              >
                {cmd.label}
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-2 text-sm" style={{ color: "var(--muted)" }}>
              No commands found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
