"use client";

import { MotionConfig } from "motion/react";
import { RegionProvider } from "@/components/region/RegionProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <RegionProvider>{children}</RegionProvider>
    </MotionConfig>
  );
}
