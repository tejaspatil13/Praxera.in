import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "dark";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-midnight-950 hover:bg-midnight-900 hover:text-white",
  dark: "bg-midnight-900 text-white hover:bg-accent-strong",
  secondary: "border border-line bg-white text-ink hover:border-midnight-900",
  ghost: "border border-white/20 text-white hover:border-white/60 hover:bg-white/5",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  size?: "md" | "lg";
};

export function ButtonLink({ href, children, variant = "primary", external, className = "", size = "md" }: Props) {
  const cls = `group inline-flex items-center justify-center gap-2 text-center sm:whitespace-nowrap rounded-full font-semibold transition-colors duration-200 ${
    size === "lg" ? "px-6 py-3.5 text-[0.95rem]" : "px-5 py-2.5 text-sm"
  } ${styles[variant]} ${className}`;
  const Icon = external ? ArrowUpRight : ArrowRight;
  const icon = (
    <Icon
      aria-hidden
      className={`h-4 w-4 transition-transform duration-200 ${external ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-x-0.5"}`}
    />
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        {icon}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {icon}
    </Link>
  );
}

export function TextLink({ href, children, external, className = "" }: Omit<Props, "variant" | "size">) {
  const cls = `group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong hover:text-midnight-900 ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
