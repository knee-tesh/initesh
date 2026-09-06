export default function SpeakingBars() {
  return (
    <span aria-hidden className="inline-flex items-end gap-[3px] h-3.5">
      <span className="speaking-bar w-[3px] h-3 rounded-full bg-terracotta" />
      <span className="speaking-bar w-[3px] h-3 rounded-full bg-teal [animation-delay:0.15s]" />
      <span className="speaking-bar w-[3px] h-3 rounded-full bg-gold [animation-delay:0.3s]" />
    </span>
  );
}
