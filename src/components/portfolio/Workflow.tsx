"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { workflow } from "@/content/portfolio";
import { MaskedLines, SectionLabel } from "./shared";

function Title() {
  return (
    <>
      <SectionLabel index="04">My workflow</SectionLabel>
      <h2 id="workflow-title" className="pf-poster mt-5 text-[clamp(3rem,7vw,6.5rem)]">
        <MaskedLines lines={["Raw footage to", <span key="f" className="text-accent">final cut.</span>]} />
      </h2>
    </>
  );
}

function StepList() {
  return (
    <ol className="relative mt-10 space-y-8 border-l border-[var(--pf-line)] pl-6">
      {workflow.map((s, i) => (
        <motion.li key={s.title} initial={{ opacity: 0, y: 24, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5 }} className="relative">
          <span aria-hidden className="absolute -left-[1.86rem] top-1.5 h-3 w-3 rounded-full bg-accent" />
          <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-1 font-display text-xl font-bold">{s.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--pf-dim)]">{s.text}</p>
        </motion.li>
      ))}
    </ol>
  );
}

/** Desktop: the section pins and scrolling drags the six stages past a growing progress line. */
function Pinned() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-52%"]);
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden pb-10">
        <div className="mx-auto w-full max-w-[96rem] px-10">
          <Title />
        </div>
        <motion.ol style={{ x }} className="mt-14 flex w-max gap-5 pl-10 pr-[20vw]">
          {workflow.map((s, i) => (
            <li key={s.title} className="flex h-64 w-[24rem] flex-col rounded-2xl border border-[var(--pf-line)] bg-[var(--pf-panel)] p-6">
              <span className="pf-poster text-6xl text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-auto font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--pf-dim)]">{s.text}</p>
            </li>
          ))}
        </motion.ol>
        <div className="mx-10 mt-10 h-px bg-[var(--pf-line)]">
          <motion.div style={{ scaleX }} className="h-px origin-left bg-accent" />
        </div>
      </div>
    </div>
  );
}

export function Workflow() {
  const reduced = useReducedMotion();
  return (
    <section id="workflow" aria-labelledby="workflow-title">
      {reduced ? null : (
        <div className="hidden lg:block">
          <Pinned />
        </div>
      )}
      <div className={`mx-auto max-w-[96rem] px-5 py-20 ${reduced ? "lg:px-10" : "lg:hidden"}`}>
        <Title />
        <StepList />
      </div>
    </section>
  );
}
