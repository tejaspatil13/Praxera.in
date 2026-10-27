"use client";

import { Globe } from "lucide-react";
import { useId } from "react";
import { regionOrder, regions, type RegionId } from "@/content/pricing";
import { useRegion } from "./RegionProvider";

type Props = {
  tone?: "light" | "dark";
  /** Show the explanatory line under the select. */
  showHint?: boolean;
  className?: string;
};

export function RegionSelector({ tone = "light", showHint = false, className = "" }: Props) {
  const { region, source, setRegion } = useRegion();
  const id = useId();
  const dark = tone === "dark";

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={`mb-1.5 block text-xs font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}
      >
        Region and currency
      </label>
      <div className="relative">
        <Globe
          aria-hidden
          className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-slate-400" : "text-slate-500"}`}
        />
        <select
          id={id}
          value={region.id}
          onChange={(e) => setRegion(e.target.value as RegionId)}
          className={`w-full appearance-none rounded-lg border py-2.5 pl-9 pr-9 text-sm font-medium transition-colors ${
            dark
              ? "border-midnight-600 bg-midnight-800 text-white hover:border-slate-500"
              : "border-line bg-white text-ink hover:border-slate-400"
          }`}
        >
          {regionOrder.map((rid) => {
            const r = regions[rid];
            return (
              <option key={rid} value={rid}>
                {r.label} — {r.currency} ({r.symbol})
              </option>
            );
          })}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-slate-400" : "text-slate-500"}`}
        >
          <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      {showHint && (
        <p className={`mt-1.5 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`} aria-live="polite">
          {source === "detected"
            ? "Set from your approximate location. Change it if this is not right."
            : source === "manual"
              ? "Your choice is remembered on this device."
              : "International pricing in US dollars is shown by default."}
        </p>
      )}
    </div>
  );
}
