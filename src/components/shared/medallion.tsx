export default function Medallion({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center flex-shrink-0 rounded-full border-2 ${className || "w-8 h-8"}`}
      style={{ boxShadow: "inset 0 0 0 2px var(--color-blush)" }}
    >
      {children}
    </span>
  );
}
