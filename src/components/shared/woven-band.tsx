export default function WovenBand() {
  return (
    <div aria-hidden className="flex justify-center gap-3 text-terracotta">
      {Array.from({ length: 16 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M7 1 L13 7 L7 13 L1 7 Z" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <circle cx="7" cy="7" r="1.1" fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}
