"use client";

import { motion } from "motion/react";
import { services } from "@/content/portfolio";
import { SectionLabel, ease } from "./shared";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="mx-auto max-w-[96rem] px-5 py-14 lg:px-10 lg:py-16">
      <SectionLabel index="02">What I do</SectionLabel>
      <h2 id="services-title" className="sr-only">Services</h2>
      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {services.map((s, i) => (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease }}
            className="rounded-2xl border border-[var(--pf-line)] bg-[var(--pf-panel)] p-5 transition-colors duration-300 hover:border-accent"
          >
            <h3 className="font-display text-lg font-bold leading-snug">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--pf-dim)]">{s.text}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
