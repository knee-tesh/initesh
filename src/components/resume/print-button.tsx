"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-3 py-1.5 text-xs font-mono border border-border rounded bg-surface text-muted hover:text-text transition-colors print:hidden"
    >
      Print
    </button>
  );
}
