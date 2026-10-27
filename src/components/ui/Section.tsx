import { Reveal } from "./Reveal";

type HeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({ eyebrow, title, intro, tone = "light", align = "left", as = "h2", className = "" }: HeadingProps) {
  const dark = tone === "dark";
  const H = as;
  return (
    <Reveal className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <p className={`eyebrow mb-4 flex items-center gap-3 ${align === "center" ? "justify-center" : ""} ${dark ? "text-accent" : "text-accent-strong"}`}>
          <span aria-hidden className={`h-px w-6 ${dark ? "bg-accent" : "bg-accent-strong"}`} />
          {eyebrow}
        </p>
      )}
      <H
        className={`font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-balance sm:text-[2.6rem] ${dark ? "text-white" : "text-midnight-900"}`}
      >
        {title}
      </H>
      {intro && (
        <p className={`mt-5 text-lg leading-relaxed text-pretty ${dark ? "text-slate-300" : "text-slate-600"}`}>{intro}</p>
      )}
    </Reveal>
  );
}

type SectionProps = {
  id?: string;
  tone?: "white" | "mist" | "dark";
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
};

export function Section({ id, tone = "white", className = "", children, labelledBy }: SectionProps) {
  const bg =
    tone === "dark" ? "on-dark bg-midnight-900 text-white" : tone === "mist" ? "bg-mist" : "bg-white";
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative py-20 sm:py-28 ${bg} ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}
