"use client";

import { motion, useReducedMotion } from "motion/react";
import { MapPin, Users, FileSpreadsheet, MessageCircle } from "lucide-react";
import { leadKaro } from "@/content/caseStudies";

const icons = [MapPin, Users, FileSpreadsheet, MessageCircle];
const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  tone?: "light" | "dark";
  /** "row": four columns on large screens. "stack": a vertical flow for narrow columns. */
  layout?: "row" | "stack";
};

/** The LeadKaro workflow as described on the founder’s portfolio. */
export function LeadFlow({ tone = "dark", layout = "row" }: Props) {
  const reduce = useReducedMotion();
  const dark = tone === "dark";
  const stack = layout === "stack";
  const steps = leadKaro.steps;

  return (
    <motion.ol
      className={`relative grid ${stack ? "gap-3" : "gap-3 sm:grid-cols-2 lg:grid-cols-4"}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
    >
      {stack && (
        <span aria-hidden className={`absolute bottom-8 left-[2.2rem] top-8 w-px ${dark ? "bg-white/10" : "bg-line"}`}>
          <motion.span
            className="block h-full w-full origin-top bg-accent-strong"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease }}
          />
        </span>
      )}
      {steps.map((step, i) => {
        const Icon = icons[i];
        const last = i === steps.length - 1;
        return (
          <motion.li
            key={step.title}
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
            className={`relative rounded-2xl border ${stack ? "flex items-start gap-4 p-4" : "p-5"} ${
              dark ? "border-white/10 bg-midnight-800" : "border-line bg-white shadow-card"
            } ${last ? (dark ? "border-accent/40" : "border-accent-strong/40") : ""}`}
          >
            <span
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                dark ? "bg-accent/15 text-accent" : "bg-accent-soft text-accent-strong"
              }`}
            >
              <Icon aria-hidden className="h-5 w-5" />
            </span>
            <div className={stack ? "" : "mt-4"}>
              <p className={`font-mono text-[0.68rem] tracking-widest ${dark ? "text-slate-400" : "text-slate-500"}`}>STEP {i + 1}</p>
              <h3 className={`mt-1 font-display font-bold ${dark ? "text-white" : "text-midnight-900"}`}>{step.title}</h3>
              <p className={`mt-1 text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{step.body}</p>
            </div>
            {!stack && !last && (
              <span aria-hidden className="absolute -right-3 top-1/2 z-10 hidden h-px w-3 lg:block">
                <svg width="12" height="2" className="overflow-visible">
                  <line x1="0" y1="1" x2="12" y2="1" stroke="#2dd4bf" strokeWidth="1.5" className={reduce ? undefined : "flow-line"} />
                </svg>
              </span>
            )}
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
