"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "@/content/portfolio";
import { MaskedLines, SectionLabel, ease } from "./shared";

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["7%", "-7%"]);
  return (
    <section id="about" ref={ref} aria-labelledby="about-title" className="pf-light">
      <div className="mx-auto grid max-w-[96rem] items-center gap-10 overflow-hidden px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:px-10 lg:py-28">
        <motion.div initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.25 }} className="relative mx-auto aspect-[2/3] w-full max-w-sm lg:max-w-md">
          <motion.div variants={{ hidden: { clipPath: "inset(100% 0 0 0)" }, shown: { clipPath: "inset(0% 0 0 0)" } }} transition={{ duration: 1.1, ease }} className="absolute inset-0">
            <motion.div style={{ y }} className="absolute inset-0">
              <Image src="/portfolio/tejas-patil.png" alt="Illustrated portrait of Tejas Patil in a teal blazer" fill sizes="(min-width: 1024px) 28rem, 90vw" className="object-contain" />
            </motion.div>
          </motion.div>
        </motion.div>
        <div>
          <SectionLabel index="05">About me</SectionLabel>
          <h2 id="about-title" className="pf-poster mt-5 text-[clamp(3rem,7.4vw,7rem)]">
            <MaskedLines lines={["The creative mind", <span key="e" className="text-accent">behind the edit.</span>]} />
          </h2>
          <div className="mt-7 max-w-2xl space-y-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            <p>
              I’m {profile.name}, the founder of Praxera Technologies, based in Nashik. I combine video editing, creativity and storytelling with a technical background to make digital content people actually stop for.
            </p>
            <p>
              I’m a final-year Computer Engineering student and I work as an AI Engineer Intern, building real AI systems. That technical side shapes how I produce video: I use modern AI tools alongside traditional editing, and I know how they work under the hood.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
