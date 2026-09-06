const FLOWERS = [4, 20, 36, 52, 68, 84, 100, 116, 132, 148, 164, 180, 196, 212, 228, 244, 260, 276, 292];

export default function Garland() {
  return (
    <div aria-hidden className="pointer-events-none select-none text-terracotta">
      <svg viewBox="0 0 320 56" className="w-full max-w-[360px]">
        <path
          d="M6 44 Q74 10 160 20 T314 46"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.45"
        />
        {FLOWERS.map((x, i) => {
          const d = Math.abs(x - 160) / 160;
          const y = 18 + d * d * 32;
          const size = 5 + (i % 3) * 1.5;
          return (
            <g key={x} transform={`translate(${x} ${y})`}>
              <circle r={size} fill="currentColor" />
              <circle r={size * 0.45} fill="var(--color-paper)" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
