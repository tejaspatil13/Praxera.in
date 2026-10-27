"use client";

import { motion, useReducedMotion } from "motion/react";
import { Landmark, Globe2, Monitor, FileSpreadsheet } from "lucide-react";
import { callList } from "@/content/caseStudies";

const ease = [0.22, 1, 0.36, 1] as const;

function Flow({ vertical = false }: { vertical?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className={`flex items-center justify-center ${vertical ? "h-10" : "h-full w-12 shrink-0"}`}>
      <svg className="overflow-visible" width={vertical ? 2 : 48} height={vertical ? 40 : 2}>
        <line
          x1={vertical ? 1 : 0}
          y1={vertical ? 0 : 1}
          x2={vertical ? 1 : 48}
          y2={vertical ? 40 : 1}
          stroke="#0f766e"
          strokeWidth="1.5"
          className={reduce ? undefined : "flow-line"}
        />
      </svg>
    </div>
  );
}

/** How the call-list tool combines two public sources — as documented in the project PDF. */
export function DataSourcesDiagram() {
  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
      className="flex flex-col items-stretch lg:flex-row"
    >
      <div className="flex flex-col gap-4 lg:w-[38%]">
        <motion.div variants={item} className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-midnight-900 text-white">
              <Landmark aria-hidden className="h-5 w-5" />
            </span>
            <h3 className="font-display font-bold text-midnight-900">Government rating list</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{callList.sources.ratingList}</p>
        </motion.div>
        <motion.div variants={item} className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-midnight-900 text-white">
              <Globe2 aria-hidden className="h-5 w-5" />
            </span>
            <h3 className="font-display font-bold text-midnight-900">Public business listings</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{callList.sources.listings}</p>
        </motion.div>
      </div>

      <div className="lg:hidden">
        <Flow vertical />
      </div>
      <div className="hidden lg:block">
        <Flow />
      </div>

      <motion.div variants={item} className="on-dark flex flex-col justify-center rounded-2xl bg-midnight-900 p-6 text-white lg:w-[28%]">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Monitor aria-hidden className="h-5 w-5" />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold">The call-list tool</h3>
        <p className="mt-1 text-sm text-slate-300">Runs on one office computer; the team opens it in a browser.</p>
        <ul className="mt-4 space-y-1.5 text-sm text-slate-200">
          <li>· Filters to currently listed properties</li>
          <li>· Matches postcode, building number and street</li>
          <li>· Formats numbers as +44</li>
        </ul>
      </motion.div>

      <div className="lg:hidden">
        <Flow vertical />
      </div>
      <div className="hidden lg:block">
        <Flow />
      </div>

      <motion.div variants={item} className="flex flex-col justify-center rounded-2xl border border-accent-strong/30 bg-accent-soft/40 p-6 lg:flex-1">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success text-white">
          <FileSpreadsheet aria-hidden className="h-5 w-5" />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-midnight-900">Call list</h3>
        <p className="mt-1 text-sm text-slate-600">Excel sheet in the team’s usual columns, ready to download.</p>
      </motion.div>
    </motion.div>
  );
}
