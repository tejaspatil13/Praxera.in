"use client";

import { motion } from "motion/react";
import { aiCapabilities } from "@/content/portfolio";
import { MaskedLines, SectionLabel, ease } from "./shared";

const COLS = 7;
const ROWS = 12;
/** A fixed scatter, so server and browser render the same mosaic. */
const delay = (i: number) => ((i * 7919) % 97) / 97;

/** A prompt resolves into a finished frame, tile by tile. */
function Generation() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-sm">
      <motion.p initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1.4, ease: "linear" }} className="overflow-hidden whitespace-nowrap font-mono text-xs text-accent">
        &gt; generate: cinematic reel cover, 9:16
      </motion.p>
      <div className="relative mt-3 aspect-[9/16] overflow-hidden rounded-2xl border border-[var(--pf-line)] bg-[var(--pf-panel)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/portfolio/poster-research.jpg" alt="" loading="lazy" className="pf-kenburns absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
          {Array.from({ length: COLS * ROWS }, (_, i) => (
            <motion.span key={i} initial={{ opacity: 1 }} whileInView={{ opacity: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.35, delay: 0.5 + delay(i) * 1.6 }} className="bg-[var(--pf-panel)] outline outline-1 -outline-offset-1 outline-white/5" />
          ))}
        </div>
        <motion.span initial={{ top: "0%" }} whileInView={{ top: "100%" }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 2.2, delay: 0.3, ease: "easeInOut" }} className="absolute inset-x-0 h-px bg-accent shadow-[0_0_18px_4px_rgb(45_212_191/0.5)]" />
      </div>
    </div>
  );
}

export function AiSection() {
  return (
    <section id="ai" aria-labelledby="ai-title" className="relative overflow-hidden border-y border-[var(--pf-line)] bg-[var(--pf-panel-2)]">
      <div aria-hidden className="pf-sprockets" />
      <div className="mx-auto grid max-w-[96rem] items-center gap-14 px-5 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-28">
        <div>
          <SectionLabel index="03">Beyond the timeline</SectionLabel>
          <h2 id="ai-title" className="pf-poster mt-5 text-[clamp(2.9rem,7vw,7rem)]">
            <MaskedLines lines={["Creativity meets", <span key="a" className="text-accent">artificial intelligence</span>]} />
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            With the power of AI, I go beyond traditional editing. From generating visuals and creating cinematic scenes to intelligent voiceovers, motion concepts, and creative automation, I use modern AI tools to bring ideas to life.
          </p>
          <ul className="mt-9 border-t border-[var(--pf-line)]">
            {aiCapabilities.map((c, i) => (
              <motion.li
                key={c}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: i * 0.04, ease }}
                className="group flex items-center justify-between gap-4 border-b border-[var(--pf-line)] py-3 transition-colors hover:text-accent"
              >
                <span className="font-display text-lg font-semibold transition-transform duration-300 group-hover:translate-x-2">{c}</span>
                <span className="font-mono text-xs text-[var(--pf-dim)]">{String(i + 1).padStart(2, "0")}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <Generation />
      </div>
      <div aria-hidden className="pf-sprockets" />
    </section>
  );
}
