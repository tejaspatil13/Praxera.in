type Props = {
  tone?: "light" | "dark";
  className?: string;
};

/** The Praxera mark: two strokes forming a forward-moving “P” — practice meeting progress. */
export function Mark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="#0a1428" stroke="rgb(255 255 255 / 0.14)" />
      <path d="M10 24V8h7.5a5.5 5.5 0 0 1 0 11H14" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 19l5.5 5" fill="none" stroke="#2dd4bf" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ tone = "light", className = "" }: Props) {
  const dark = tone === "dark";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.05rem] font-extrabold tracking-[0.2em] ${dark ? "text-white" : "text-midnight-900"}`}
        >
          PRAXERA
        </span>
        <span
          className={`mt-1 font-mono text-[0.55rem] font-medium tracking-[0.42em] ${dark ? "text-slate-400" : "text-slate-500"}`}
        >
          TECHNOLOGIES
        </span>
      </span>
    </span>
  );
}
