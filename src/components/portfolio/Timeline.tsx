"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { chapters } from "@/content/portfolio";

/** 30 frames a second, as a film timecode. */
function timecode(seconds: number) {
  const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
  return `00:${pad(seconds / 60)}:${pad(seconds % 60)}:${pad((seconds % 1) * 30)}`;
}

/** The page reads as an edit: each section is a clip and the scroll position is the playhead. */
export function Timeline() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const left = useTransform(progress, (p) => `${p * 100}%`);
  const code = useRef<HTMLSpanElement>(null);
  const phoneCode = useRef<HTMLSpanElement>(null);
  const [sizes, setSizes] = useState<number[]>(() => chapters.map(() => 1));
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const measure = () => {
      const heights = chapters.map(({ id }) => document.getElementById(id)?.offsetHeight ?? 1);
      setSizes(heights);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    for (const el of [code.current, phoneCode.current]) if (el) el.textContent = timecode(p * 150);
    const total = sizes.reduce((a, b) => a + b, 0);
    let edge = 0;
    const index = sizes.findIndex((s) => (edge += s) / total > p);
    setCurrent(index < 0 ? chapters.length - 1 : index);
  });

  return (
    <>
    <div aria-hidden className="lg:hidden">
      <motion.span style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-accent" />
      <span className="fixed bottom-3 left-3 z-[70] flex items-center gap-1.5 rounded-full bg-[var(--pf-bg)]/90 px-2.5 py-1 font-mono text-[0.65rem] text-slate-300">
        <span className="pf-rec h-1.5 w-1.5 rounded-full bg-accent" />
        <span ref={phoneCode}>00:00:00:00</span>
      </span>
    </div>
    <nav aria-label="Page sections" className="fixed inset-x-0 bottom-0 z-[70] hidden border-t border-[var(--pf-line)] bg-[var(--pf-bg)] lg:block">
      <div className="flex h-10 items-center gap-4 px-5">
        <span className="flex w-36 shrink-0 items-center gap-2 font-mono text-xs text-[var(--pf-dim)]">
          <span className="pf-rec h-1.5 w-1.5 rounded-full bg-accent" />
          <span ref={code}>00:00:00:00</span>
        </span>
        <div className="relative flex h-6 min-w-0 flex-1 gap-px">
          {chapters.map((c, i) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              aria-current={current === i ? "true" : undefined}
              style={{ flexGrow: sizes[i], flexBasis: 0 }}
              className={`flex min-w-0 items-center overflow-hidden rounded-[3px] px-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] transition-colors ${
                current === i ? "bg-accent/20 text-accent" : "bg-white/[0.06] text-[var(--pf-dim)] hover:bg-white/15 hover:text-white"
              }`}
            >
              <span className="truncate">{c.label}</span>
            </a>
          ))}
          <motion.span aria-hidden style={{ left }} className="pointer-events-none absolute -bottom-1 -top-1 w-px bg-white shadow-[0_0_8px_rgb(255_255_255/0.7)]" />
        </div>
      </div>
    </nav>
    </>
  );
}
