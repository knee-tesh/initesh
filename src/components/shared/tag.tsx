type TagProps = {
  label: string;
  color?: string;
};

export default function Tag({ label, color = "var(--color-accent)" }: TagProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blush border border-hem text-[11px] uppercase tracking-wider text-stone font-[family-name:var(--font-script)]">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color || "var(--color-terracotta)" }} />
      {label}
    </span>
  );
}
