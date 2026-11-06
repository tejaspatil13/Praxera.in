"use client";

import { useMemo, useRef, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { videoCategories, type PortfolioVideo } from "@/content/portfolio";
import { parseVideoUrl } from "@/lib/videoSource";
import { MaskedLines, SectionLabel, ease } from "./shared";
import { VideoPlayer } from "./VideoPlayer";

const shell = "mx-auto max-w-[96rem] px-4 py-20 sm:px-5 lg:px-10 lg:py-28";
const grid = "mt-10 grid grid-flow-dense grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-4 lg:gap-x-4";

export function WorkSkeleton() {
  return (
    <section id="work" className={shell}>
      <div className={grid}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-[9/16] animate-pulse rounded-2xl bg-[var(--pf-panel)]" />
        ))}
      </div>
    </section>
  );
}

function Card({ video, index, active, onStart }: { video: PortfolioVideo; index: number; active: boolean; onStart: () => void }) {
  const item = useRef<HTMLLIElement>(null);
  // Uploaded files can be any shape, so the file itself corrects this once it loads.
  const [vertical, setVertical] = useState(parseVideoUrl(video.videoUrl)?.vertical ?? false);

  return (
    <motion.li
      ref={item}
      layout="position"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.12 }}
      // On a phone the playing video grows to full width, then settles in the middle of the screen.
      onLayoutAnimationComplete={() => {
        if (active && innerWidth < 768) item.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }}
      transition={{ layout: { duration: 0.5, ease } }}
      className={`scroll-mb-14 scroll-mt-6 ${active ? "col-span-2 md:col-span-1" : ""}`}
    >
      <motion.div
        variants={{ hidden: { clipPath: "inset(14% 14% 14% 14% round 28px)", scale: 1.16, opacity: 0 }, shown: { clipPath: "inset(0% 0% 0% 0% round 16px)", scale: 1, opacity: 1 } }}
        transition={{ duration: 1, delay: (index % 4) * 0.1, ease }}
        className={`pf-crop relative overflow-hidden rounded-2xl bg-black ring-2 transition-shadow duration-300 ${active ? "ring-accent" : "ring-transparent"} ${active && !vertical ? "aspect-video md:aspect-[9/16]" : "aspect-[9/16]"}`}
      >
        <VideoPlayer
          video={video}
          active={active}
          onShape={setVertical}
          onStart={() => {
            onStart();
            if (innerWidth >= 768) item.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }}
        />
      </motion.div>
      <div className="mt-3 px-0.5">
        <p className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent">
          {active ? <span className="pf-rec h-1.5 w-1.5 rounded-full bg-accent" /> : null}
          {active ? "Now playing" : video.category}
        </p>
        <h3 className="mt-1 font-display text-base font-bold leading-snug sm:text-lg">{video.title}</h3>
        {video.description ? <p className="mt-1 hidden text-sm leading-relaxed text-[var(--pf-dim)] sm:line-clamp-2 sm:block">{video.description}</p> : null}
      </div>
    </motion.li>
  );
}

export function WorkGallery({ videos }: { videos: PortfolioVideo[] }) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<string | null>(null);
  const tabs = useMemo(() => ["All", ...videoCategories.filter((c) => videos.some((v) => v.category === c))], [videos]);
  const shown = filter === "All" ? videos : videos.filter((v) => v.category === filter);

  return (
    <section id="work" aria-labelledby="work-title" className={shell}>
      <SectionLabel index="01">Selected work</SectionLabel>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <h2 id="work-title" className="pf-poster text-[clamp(3.4rem,11vw,10rem)]">
          <MaskedLines lines={["The cut", <span key="r" className="text-accent">room.</span>]} />
        </h2>
        {videos.length > 5 ? (
          <LayoutGroup>
            <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
              {tabs.map((t) => (
                <button key={t} onClick={() => setFilter(t)} aria-pressed={filter === t} className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${filter === t ? "text-[var(--pf-bg)]" : "text-[var(--pf-dim)] hover:text-white"}`}>
                  {filter === t ? <motion.span layoutId="pf-tab" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 380, damping: 32 }} /> : null}
                  <span className="relative">{t}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        ) : null}
      </div>

      {videos.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-[var(--pf-line)] p-10 text-center text-[var(--pf-dim)]">New work is on its way.</p>
      ) : (
        <ul className={grid}>
          {shown.map((v, i) => (
            <Card key={v.id} video={v} index={i} active={active === v.id} onStart={() => setActive(v.id)} />
          ))}
        </ul>
      )}
    </section>
  );
}
