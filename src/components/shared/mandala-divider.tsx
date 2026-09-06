export default function MandalaDivider() {
  return (
    <div aria-hidden className="flex justify-center my-12 text-gold">
      <svg width="240" height="16" viewBox="0 0 240 16" fill="none">
        <path d="M12 8h70" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <path d="M158 8h70" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1" />
        <circle cx="230" cy="8" r="3" stroke="currentColor" strokeWidth="1" />
        <circle cx="26" cy="8" r="1.4" fill="currentColor" />
        <circle cx="214" cy="8" r="1.4" fill="currentColor" />
        <path d="M120 1c2.5 2.5 6.5 2.5 9 0 .5 3-1.5 7-4.5 7s-5-4-4.5-7z" stroke="currentColor" strokeWidth="1" />
        <circle cx="120" cy="8" r="1.6" fill="currentColor" />
        <circle cx="58" cy="8" r="1.4" fill="currentColor" />
        <circle cx="182" cy="8" r="1.4" fill="currentColor" />
      </svg>
    </div>
  );
}
