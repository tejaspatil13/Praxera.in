"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export const ease = [0.22, 1, 0.36, 1] as const;

/** Lines slide up from behind a mask, the way title cards are cut in. The mask watches for scrolling, because the hidden text inside it never counts as visible. */
export function MaskedLines({ lines, className = "", delay = 0, animate }: { lines: ReactNode[]; className?: string; delay?: number; animate?: boolean }) {
  return (
    <>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className={`block overflow-hidden pb-[0.04em] ${className}`}
          initial="hidden"
          {...(animate === undefined ? { whileInView: "shown", viewport: { once: true, amount: 0.5 } } : { animate: animate ? "shown" : "hidden" })}
        >
          <motion.span className="block origin-left" variants={{ hidden: { y: "108%", scale: 1.14 }, shown: { y: 0, scale: 1 } }} transition={{ duration: 0.95, delay: delay + i * 0.08, ease }}>
            {line}
          </motion.span>
        </motion.span>
      ))}
    </>
  );
}

/**
 * A silent background loop that only runs while on screen, so it never competes with the video someone pressed.
 * Loading starts ahead of time, but playback waits for the screen: iPhones pause a muted video started off screen and never resume it.
 * Low Power Mode and some browsers refuse background video outright, so `moving` swaps in an animated image, which they still run.
 */
export function LoopVideo({ src, poster, moving, className, ahead = "60%" }: { src: string; poster?: string; moving?: string; className?: string; ahead?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [refused, setRefused] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let visible = false;
    const stopped = () => {
      if (visible) setRefused(true);
    };
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // These clips are small. Loading each fully frees its connection for the video someone presses.
        video.preload = "auto";
        near.disconnect();
      },
      { rootMargin: `${ahead} 0px` },
    );
    const onScreen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) return video.pause();
      void video.play().catch((err: Error) => {
        if (err.name === "NotAllowedError") stopped();
      });
    });
    video.addEventListener("pause", stopped);
    near.observe(video);
    onScreen.observe(video);
    return () => {
      near.disconnect();
      onScreen.disconnect();
      video.removeEventListener("pause", stopped);
    };
  }, [ahead]);
  // eslint-disable-next-line @next/next/no-img-element
  if (refused && moving) return <img src={moving} alt="" aria-hidden className={className} />;
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-hidden className={className} />;
}

export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-[var(--pf-dim)]">
      <span className="text-accent">{index}</span>
      <span className="h-px w-8 bg-[var(--pf-line)]" />
      {children}
    </p>
  );
}

/** Pulls gently towards the pointer. Touch screens never fire these events, so it stays still there. */
export function Magnetic({ href, children, variant = "solid", ...rest }: { href: string; children: ReactNode; variant?: "solid" | "ghost"; target?: string; rel?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  return (
    <motion.a
      ref={ref}
      href={href}
      {...rest}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.28);
        y.set((e.clientY - r.top - r.height / 2) * 0.4);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={`group inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-semibold tracking-wide transition-colors ${
        variant === "solid" ? "bg-accent text-[var(--pf-bg)] hover:bg-[#f6f0e6]" : "border border-white/25 text-white backdrop-blur hover:border-white hover:bg-white hover:text-[var(--pf-bg)]"
      }`}
    >
      {children}
    </motion.a>
  );
}
