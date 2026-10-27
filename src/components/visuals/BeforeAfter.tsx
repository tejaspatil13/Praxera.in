"use client";

import { motion } from "motion/react";
import { Landmark, Copy, MapPin, Table2, Search, GitMerge, FileSpreadsheet, RotateCcw, Check } from "lucide-react";
import { callList } from "@/content/caseStudies";

const ease = [0.22, 1, 0.36, 1] as const;
const manualIcons = [Landmark, Copy, MapPin, Table2];
const autoIcons = [Search, GitMerge, FileSpreadsheet];

export function BeforeAfter() {
  const { demo } = callList;
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Manual */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.22 } } }}
        className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8"
      >
        <div className="flex items-center justify-between">
          <p className="eyebrow text-warn">Before · by hand</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warn-soft px-2.5 py-1 text-xs font-medium text-warn">
            <RotateCcw aria-hidden className="h-3.5 w-3.5" /> Repeated for every contact
          </span>
        </div>
        <ol className="mt-6 flex-1 space-y-3">
          {callList.manualSteps.map((s, i) => {
            const Icon = manualIcons[i];
            return (
              <motion.li
                key={s.title}
                variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } } }}
                className="flex items-start gap-4 rounded-xl border border-dashed border-line bg-mist/60 p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 ring-1 ring-line">
                  <Icon aria-hidden className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-midnight-900">
                    {i + 1}. {s.title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-600">{s.body}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
        <div className="mt-6 border-t border-line pt-5">
          <p className="font-display text-3xl font-bold text-warn">2–3 hours</p>
          <p className="mt-1 text-sm text-slate-600">for one person to build a list of 50–60 contacts — the team’s stated manual process.</p>
        </div>
      </motion.div>

      {/* Automated */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.28, delayChildren: 0.3 } } }}
        className="on-dark relative flex flex-col overflow-hidden rounded-2xl bg-midnight-900 p-6 text-white sm:p-8"
      >
        <div aria-hidden className="grid-fade pointer-events-none absolute inset-0" />
        <div className="relative flex items-center justify-between">
          <p className="eyebrow text-accent">After · automated</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
            <Check aria-hidden className="h-3.5 w-3.5" /> One search
          </span>
        </div>
        <ol className="relative mt-6 flex-1 space-y-3">
          {callList.automatedSteps.map((s, i) => {
            const Icon = autoIcons[i];
            return (
              <motion.li
                key={s.title}
                variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } } }}
                className="relative flex items-start gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Icon aria-hidden className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {i + 1}. {s.title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-300">{s.body}</p>
                </div>
                <motion.span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-accent"
                  variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.7, ease, delay: 0.15 } } }}
                />
              </motion.li>
            );
          })}
        </ol>
        <div className="relative mt-6 border-t border-white/10 pt-5">
          <p className="font-display text-3xl font-bold text-accent">{demo.secondsToResults} seconds</p>
          <p className="mt-1 text-sm text-slate-300">
            from clicking Search to results in the demonstrated search ({demo.context}).
          </p>
        </div>
      </motion.div>
    </div>
  );
}
