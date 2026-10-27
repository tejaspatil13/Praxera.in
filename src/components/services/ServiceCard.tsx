import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/content/services";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <Link
      href={`/services#${service.id}`}
      className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent-strong/40 hover:shadow-lift"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-midnight-900 text-accent transition-colors duration-300 group-hover:bg-accent-strong group-hover:text-white">
        <Icon aria-hidden className="h-5 w-5" />
      </span>
      <h3 className="mt-5 font-display text-lg font-bold leading-snug text-midnight-900">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{service.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong">
        {service.outcome}
        <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
