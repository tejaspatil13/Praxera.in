"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

/** Desktop only: a ring trails the pointer and names what a click will do. The real cursor stays visible. */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setActive(true);
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(target?.getAttribute("data-cursor") ?? "");
    };
    // The page can move under a still pointer, which would leave a stale label behind.
    const clear = () => setLabel("");
    addEventListener("pointermove", move, { passive: true });
    addEventListener("scroll", clear, { passive: true });
    addEventListener("click", clear);
    return () => {
      removeEventListener("pointermove", move);
      removeEventListener("scroll", clear);
      removeEventListener("click", clear);
    };
  }, [x, y]);

  if (!active) return null;
  return (
    <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[80]">
      <motion.div
        animate={{ width: label ? 84 : 28, height: label ? 84 : 28, backgroundColor: label ? "#ff2a3c" : "rgba(255,42,60,0)" }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--pf-bg)]"
      >
        <AnimatePresence>
          {label ? (
            <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
