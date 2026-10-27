"use client";

import { motion } from "motion/react";
import { processSteps } from "@/content/process";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProcessSteps({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className="relative">
      {/* Track that draws across the steps on large screens */}
      <div aria-hidden className={`absolute left-0 right-0 top-[1.375rem] hidden h-px lg:block ${dark ? "bg-white/10" : "bg-line"}`}>
        <motion.div
          className="h-full origin-left bg-accent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1.8, ease }}
        />
      </div>

      <motion.ol
        className="relative grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
      >
        {processSteps.map((step, i) => (
          <motion.li
            key={step.title}
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }}
            className="relative flex gap-4 lg:block"
          >
            <span
              className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-medium ${
                dark ? "border-midnight-600 bg-midnight-900 text-accent" : "border-line bg-white text-accent-strong"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="lg:mt-5">
              <h3 className={`font-display text-lg font-bold ${dark ? "text-white" : "text-midnight-900"}`}>
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{step.body}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
