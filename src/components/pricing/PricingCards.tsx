"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { engagements, formatPrice, priceLists } from "@/content/pricing";
import { useRegion } from "@/components/region/RegionProvider";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function PricingCards({ compact = false }: { compact?: boolean }) {
  const { region } = useRegion();
  const prices = priceLists[region.id];

  return (
    <RevealGroup className={`grid gap-5 ${compact ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2"}`}>
      {engagements.map((e) => {
        const price = prices[e.id];
        return (
          <RevealItem
            as="article"
            key={e.id}
            className={`relative flex flex-col rounded-2xl border bg-white p-6 transition-shadow duration-300 hover:shadow-lift sm:p-7 ${
              e.highlight ? "border-accent-strong/50 shadow-card ring-1 ring-accent-strong/20" : "border-line shadow-card"
            }`}
          >
            {e.highlight && (
              <span className="absolute -top-3 left-6 rounded-full bg-midnight-900 px-3 py-1 text-[0.7rem] font-semibold tracking-wide text-accent">
                Recommended starting point
              </span>
            )}
            <p className="eyebrow text-slate-500">{e.billing === "monthly" ? "Monthly retainer" : "One-time project fee"}</p>
            <h3 className="mt-2 font-display text-xl font-bold leading-snug text-midnight-900">{e.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{e.summary}</p>

            <div className="mt-5 rounded-xl bg-mist px-4 py-3.5">
              {price ? (
                <>
                  <p className="font-display text-2xl font-bold text-midnight-900">
                    {formatPrice(price, region)}
                    {e.billing === "monthly" && <span className="text-base font-medium text-slate-500"> / month</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">Final price depends on agreed scope.</p>
                </>
              ) : (
                <>
                  <p className="font-display text-base font-bold text-midnight-900">Request a tailored quote</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Quoted in {region.currency} ({region.symbol}) after we understand your requirements.
                  </p>
                </>
              )}
            </div>

            {!compact && (
              <>
                <p className="mt-6 text-sm font-semibold text-midnight-900">Suitable for</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{e.suitableFor}</p>
                <p className="mt-5 text-sm font-semibold text-midnight-900">Includes</p>
                <ul className="mt-2 space-y-2">
                  {e.includes.map((inc) => (
                    <li key={inc} className="flex gap-2.5 text-sm text-slate-600">
                      <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-auto pt-6">
              <Link
                href={`/contact?interest=${e.cta.interest}`}
                className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  e.highlight ? "bg-midnight-900 text-white hover:bg-accent-strong" : "border border-line text-ink hover:border-midnight-900"
                }`}
              >
                {e.cta.label}
                <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

/** Inline line confirming which currency quotes will use — shown on service and contact pages. */
export function CurrencyNote({ className = "" }: { className?: string }) {
  const { region } = useRegion();
  return (
    <p className={`text-sm text-slate-600 ${className}`}>
      Quotes are prepared in{" "}
      <strong className="font-semibold text-midnight-900">
        {region.currency} ({region.symbol})
      </strong>{" "}
      for {region.id === "INTL" ? "international clients" : region.label}.
    </p>
  );
}
