type TagProps = {
  label: string;
  color?: string;
};

export default function Tag({ label, color = "var(--color-accent)" }: TagProps) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-medium font-[family-name:var(--font-mono)]"
      style={{
        backgroundColor: color + "15",
        color: color,
      }}
    >
      {label}
    </span>
  );
}
