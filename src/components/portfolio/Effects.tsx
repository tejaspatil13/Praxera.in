"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { craftWords } from "@/content/portfolio";
import { LoopVideo } from "./shared";

/** Moving grain over the whole page. */
export function FilmGrain() {
  return <div aria-hidden className="pf-grain" />;
}

export function LightLeaks() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="pf-leak -left-[10%] top-[10%] h-[55vmax] w-[40vmax] bg-[radial-gradient(closest-side,rgb(255_42_60/0.32),transparent)]" />
      <span className="pf-leak -right-[15%] bottom-[-10%] h-[50vmax] w-[50vmax] bg-[radial-gradient(closest-side,rgb(179_18_42/0.34),transparent)] [animation-delay:-5s] [animation-duration:15s]" />
    </div>
  );
}

const wall = ["dental", "globe", "calls"];

/**
 * Scrolling opens a giant word onto a wall of reels. The reels stay at their true 9:16 shape and full resolution,
 * because cropping them to a wide screen or zooming them far makes them blurry. Phones show two side by side.
 * Each reel has a still, so the word is never black on black while it loads.
 */
export function ZoomThrough() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // The stencil is drawn at 1.5x, so 2/3 is its normal size on screen. Just over it overlaps every edge of the screen.
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.67, 4], { clamp: true });
  const title = useTransform(scrollYProgress, [0.28, 0.5], [1, 0]);
  const settle = useTransform(scrollYProgress, [0, 0.5], [1.06, 1]);
  const end = useTransform(scrollYProgress, [0.88, 1], [0, 1]);

  if (reduced) return null;
  return (
    <section ref={ref} aria-hidden className="relative h-[220vh]">
      <div className="sticky top-0 h-lvh overflow-hidden">
        <motion.div style={{ scale: settle }} className="absolute inset-0 flex items-center justify-center gap-2 will-change-transform lg:gap-3">
          {wall.map((name, i) => (
            <LoopVideo key={name} src={`/portfolio/wall-${name}.mp4`} poster={`/portfolio/wall-${name}.jpg`} moving={`/portfolio/wall-${name}.webp`} ahead="150%" className={`aspect-[9/16] w-[calc(50%-0.25rem)] rounded-lg object-cover lg:h-full lg:w-auto lg:rounded-xl ${i === 2 ? "hidden lg:block" : ""}`} />
          ))}
        </motion.div>
        {/* A solid black sheet with the word cut out. It is drawn once, then only scaled, so the videos behind stay smooth. */}
        <motion.div style={{ scale, opacity: title }} className="absolute -left-[18%] -top-1/4 h-[150%] w-[150%] origin-[36%_50%] will-change-transform">
          <svg width="100%" height="100%" className="block">
            <defs>
              <mask id="pf-play">
                <rect width="100%" height="100%" fill="white" />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="black" className="pf-poster text-[78vw] md:text-[clamp(13.5rem,54vw,51rem)]">
                  PLAY
                </text>
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="var(--pf-bg)" mask="url(#pf-play)" />
          </svg>
        </motion.div>
        <motion.div style={{ opacity: end }} className="absolute inset-0 bg-[var(--pf-bg)]" />
      </div>
    </section>
  );
}

/** Giant craft words that race and lean with the speed of the scroll. */
export function SpeedMarquee({ direction = 1 }: { direction?: 1 | -1 }) {
  const box = useRef<HTMLDivElement>(null);
  const visible = useInView(box);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const speed = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 40 });
  const skew = useTransform(speed, [-2500, 2500], [-14, 14], { clamp: true });
  const offset = useMotionValue(0);
  const x = useTransform(offset, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    if (reduced || !visible) return;
    const boost = 1 + Math.min(Math.abs(speed.get()) / 220, 9);
    let next = offset.get() - direction * 0.0016 * delta * boost;
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    offset.set(next);
  });

  return (
    <div ref={box} aria-hidden className="overflow-hidden border-y border-[var(--pf-line)] py-5">
      <motion.div style={{ x, skewX: skew }} className="pf-poster flex w-max gap-10 whitespace-nowrap text-[clamp(3.2rem,9vw,8rem)] will-change-transform">
        {[...craftWords, ...craftWords, ...craftWords, ...craftWords].map((word, i) => (
          <span key={i} className={i % 2 ? "text-accent" : "pf-outline"}>
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
