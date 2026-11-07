"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { chapters, profile } from "@/content/portfolio";
import { LightLeaks } from "./Effects";
import { LoopVideo, Magnetic, MaskedLines, ease } from "./shared";

const reels = [
  { poster: "/portfolio/poster-dental.jpg", loop: "/portfolio/loop-dental.mp4" },
  { poster: "/portfolio/poster-research.jpg", loop: "/portfolio/loop-research.mp4" },
  { poster: "/portfolio/poster-calls.jpg", loop: "/portfolio/loop-calls.mp4" },
  { poster: "/portfolio/poster-showreel.jpg" },
];

/** Phones run one strip of loops only: the poster is already there, and several decoders at once slow the scroll. */
function Tile({ reel, motionOk, phone }: { reel: (typeof reels)[number]; motionOk: boolean; phone: boolean }) {
  return (
    <div className="relative aspect-[9/16] w-full shrink-0 overflow-hidden rounded-lg bg-[var(--pf-panel)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={reel.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {reel.loop && motionOk ? <LoopVideo src={reel.loop} poster={reel.poster} className={`absolute inset-0 h-full w-full object-cover ${phone ? "" : "hidden sm:block"}`} /> : null}
    </div>
  );
}

function Strip({ offset, y, motionOk, phone = false }: { offset: number; y: ReturnType<typeof useTransform<number, string>>; motionOk: boolean; phone?: boolean }) {
  const order = reels.map((_, i) => reels[(i + offset) % reels.length]);
  return (
    <motion.div style={{ y }} className="flex w-1/3 flex-col gap-3">
      {[...order, ...order].map((r, i) => (
        <Tile key={i} reel={r} motionOk={motionOk && i < 2} phone={phone} />
      ))}
    </motion.div>
  );
}

/** A film leader counts in once per visit on larger screens. It is decoration, so phones skip it and go straight to the picture. */
function Leader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(3);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let seen = !!reduced || innerWidth < 768;
    try {
      seen ||= !!sessionStorage.getItem("pf-leader");
      sessionStorage.setItem("pf-leader", "1");
    } catch {}
    const finish = setTimeout(() => {
      setGone(true);
      onDone();
    }, seen ? 0 : 1000);
    const tick = seen ? undefined : setInterval(() => setCount((c) => Math.max(1, c - 1)), 300);
    return () => {
      clearTimeout(finish);
      clearInterval(tick);
    };
  }, [onDone, reduced]);

  return (
    <AnimatePresence>
      {gone ? null : (
        <motion.div aria-hidden exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.7, ease }} style={{ clipPath: "inset(0 0 0 0)" }} className="pf-leader fixed inset-0 z-[90] flex items-center justify-center bg-[var(--pf-bg)]">
          <span className="absolute h-px w-full bg-white/15" />
          <span className="absolute h-full w-px bg-white/15" />
          <span className="pf-poster relative flex h-44 w-44 items-center justify-center rounded-full border border-white/25 text-7xl">{count}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], ["-14%", "-34%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["-30%", "-10%"]);
  const yC = useTransform(scrollYProgress, [0, 1], ["-8%", "-30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.76]);
  const textFade = useTransform(scrollYProgress, [0.25, 0.85], [1, 0]);
  const dim = useTransform(scrollYProgress, [0, 0.9], [1, 0.3]);
  const push = useTransform(scrollYProgress, [0, 1], [1, 1.32]);

  const px = useSpring(useMotionValue(70), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(40), { stiffness: 60, damping: 20 });
  const light = useMotionTemplate`radial-gradient(34rem circle at ${px}% ${py}%, transparent 0%, rgb(0 0 0 / 0.12) 60%, rgb(0 0 0 / 0.32) 100%)`;

  const links = chapters.filter((c) => ["work", "services", "about", "contact"].includes(c.id));

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh flex-col overflow-hidden scroll-mt-0"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 100);
        py.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      <noscript>
        <style>{`[aria-hidden][class*="z-[90]"]{display:none}`}</style>
      </noscript>
      <Leader onDone={() => setReady(true)} />

      <motion.div aria-hidden style={{ opacity: dim, scale: push }} className="absolute inset-y-0 right-0 w-full origin-center sm:w-[78%] lg:w-[58%]">
        {/* The picture pulls back into place as the leader clears. */}
        <motion.div initial={{ scale: 1.5 }} animate={ready ? { scale: 1 } : undefined} transition={{ duration: 1.8, ease }} className="flex h-full w-full gap-3 px-3">
          <Strip offset={0} y={yA} motionOk={!reduced} />
          <Strip offset={1} y={yB} motionOk={!reduced} phone />
          <Strip offset={2} y={yC} motionOk={!reduced} />
        </motion.div>
      </motion.div>
      <LightLeaks />
      <motion.div aria-hidden style={{ background: light }} className="absolute inset-0" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--pf-bg)] from-30% via-[var(--pf-bg)]/70 via-60% to-[var(--pf-bg)]/5 lg:bg-gradient-to-r lg:from-[var(--pf-bg)] lg:from-35% lg:via-[var(--pf-bg)]/70 lg:via-55% lg:to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--pf-bg)] to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[var(--pf-bg)] to-transparent" />
      {ready ? <div aria-hidden className="pf-flash pointer-events-none absolute inset-0 z-20 bg-[#ffd6da]" /> : null}

      <header className="relative z-10 mx-auto flex w-full max-w-[96rem] items-center justify-between px-5 py-5 lg:px-10">
        <a href="#top" className="pf-poster text-2xl tracking-wide">
          {profile.name}
        </a>
        <nav aria-label="Portfolio" className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="transition-colors hover:text-accent">
              {l.label}
            </a>
          ))}
        </nav>
      </header>

      <motion.div style={reduced ? undefined : { y: textY, scale: textScale, opacity: textFade }} className="relative z-10 mx-auto flex w-full max-w-[96rem] flex-1 origin-left flex-col justify-end px-5 pb-12 pt-2 lg:justify-center lg:px-10 lg:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-mono text-xs uppercase tracking-[0.2em] text-accent"
        >
          {profile.name} <span className="text-[var(--pf-dim)]">/ {profile.roles[0]}</span>
        </motion.p>
        <h1 id="hero-title" className="pf-poster mt-4 text-[clamp(3.1rem,min(10.6vw,13vh),10.5rem)]">
          <MaskedLines animate={ready} delay={0.15} lines={["I don’t just", "edit videos."]} />
          <MaskedLines animate={ready} delay={0.33} lines={["I create", <span key="x" className="pf-split inline-block text-accent">experiences.</span>]} />
        </h1>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.7, delay: 0.7, ease }} className="mt-5 max-w-xl">
          <p className="text-base leading-relaxed text-slate-200 sm:text-lg">
            From scroll-stopping Instagram reels to cinematic brand films, I transform ideas and raw footage into powerful visual stories.
          </p>
          <p className="mt-3 text-sm text-[var(--pf-dim)]">{profile.roles.join(" · ")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Magnetic href="#work">
              Explore My Work <ArrowDown aria-hidden className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </Magnetic>
            <Magnetic href="#contact" variant="ghost">
              Let’s Work Together <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
