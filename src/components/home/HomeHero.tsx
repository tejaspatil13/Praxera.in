"use client";

import { motion } from "motion/react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroWorkflow } from "@/components/visuals/HeroWorkflow";

const ease = [0.22, 1, 0.36, 1] as const;
const words = ["Less manual work.", "Smarter systems.", "Better business."];

export function HomeHero() {
  return (
    <section className="on-dark relative overflow-hidden bg-midnight-900 text-white">
      <div aria-hidden className="grid-fade pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#2f6bff]/10 blur-3xl" />

      <div className="container-page relative grid gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-28">
        <div className="lg:col-span-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="eyebrow inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300"
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            AI · Automation · Integrations · Custom software
          </motion.p>

          <h1 className="mt-7 font-display text-[2.6rem] font-extrabold leading-[1.03] tracking-tight sm:text-6xl lg:text-[3.6rem] xl:text-[4rem]">
            {words.map((w, i) => (
              <motion.span
                key={w}
                className={`block ${i === 2 ? "text-accent" : ""}`}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300 text-pretty"
          >
            Praxera Technologies helps businesses automate repetitive workflows, connect disconnected tools, and build
            practical AI-powered software that makes everyday operations simpler.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <ButtonLink href="/contact" size="lg">
              Discuss Your Project
            </ButtonLink>
            <ButtonLink href="/case-studies" variant="ghost" size="lg">
              Explore Our Work
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="lg:col-span-6"
        >
          <div className="rounded-3xl border border-white/10 bg-midnight-950/40 p-4 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-6">
            <HeroWorkflow />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
