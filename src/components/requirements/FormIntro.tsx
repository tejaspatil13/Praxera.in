"use client";

import { motion } from "motion/react";
import { Clock, ListChecks, Mic } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const notes = [
  { Icon: ListChecks, text: "3 short steps" },
  { Icon: Clock, text: "About 2 minutes" },
  { Icon: Mic, text: "Type or speak" },
];

export function FormIntro() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold leading-[1.05] tracking-tight lg:text-6xl">
        {["Project", "requirements", "form"].map((word, i) => (
          <span key={word} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className={`inline-block ${i === 1 ? "text-accent" : ""}`}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.09, ease }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease }}
        className="mt-1 text-sm text-slate-300 lg:mt-6 lg:max-w-md lg:text-lg lg:leading-relaxed"
      >
        <span className="lg:hidden">3 short steps. Type or speak.</span>
        <span className="hidden lg:inline">Fill this in so we can understand your business and suggest the right solution.</span>
      </motion.p>
      <ul className="mt-8 hidden space-y-3 lg:block">
        {notes.map(({ Icon, text }, i) => (
          <motion.li
            key={text}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease }}
            className="flex items-center gap-3 text-slate-200"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-accent backdrop-blur">
              <Icon aria-hidden className="h-4 w-4" />
            </span>
            {text}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
