export default function TerminalWindow({
  title = "nitesh@portfolio",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
        <div className="w-3 h-3 rounded-full bg-[#eab308]" />
        <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
        <span className="ml-2 text-xs text-muted font-[family-name:var(--font-mono)]">{title}</span>
      </div>
      <div className="p-4 font-[family-name:var(--font-display)] text-sm">
        {children}
      </div>
    </div>
  );
}
