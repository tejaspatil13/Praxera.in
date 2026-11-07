"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { AlertCircle, ExternalLink, Loader2, Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { parseVideoUrl, videoProviders, type ParsedVideo } from "@/lib/videoSource";

export type PlayerVideo = { title: string; videoUrl: string; thumbnailUrl: string };

export const videoPoster = (v: PlayerVideo) => v.thumbnailUrl || parseVideoUrl(v.videoUrl)?.poster || "";

type PlayerProps = { active: boolean; busy?: boolean; onStart: () => void; onShape?: (vertical: boolean) => void };

const SETTLE_MS = 1500;

/**
 * Stops playback once less than half of the video is on screen. Full screen doesn't count as scrolling away.
 * Starting a video can reflow the grid on a phone, so the returned function holds off while the page settles.
 */
function useStopOffscreen(box: RefObject<HTMLDivElement | null>, stop: () => void) {
  const visible = useRef(1);
  const heldUntil = useRef(0);
  const away = useCallback(() => visible.current < 0.5 && !document.fullscreenElement, []);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.intersectionRatio;
        if (away() && performance.now() >= heldUntil.current) stop();
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [box, stop, away]);

  return useCallback(() => {
    heldUntil.current = performance.now() + SETTLE_MS;
    setTimeout(() => {
      if (away()) stop();
    }, SETTLE_MS);
  }, [away, stop]);
}

function PlayButton({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button onClick={onClick} data-cursor="Play" aria-label={`Play ${title}`} className="group/play absolute inset-0 flex items-center justify-center">
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent text-[var(--pf-bg)] shadow-lg transition-transform duration-300 group-hover/play:scale-125">
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-accent/40 [animation-duration:2.4s]" />
        <Play aria-hidden className="relative ml-1 h-6 w-6 fill-current" />
      </span>
    </button>
  );
}

const onSlowNetwork = () => {
  const net = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!(net?.saveData || (net?.effectiveType && net.effectiveType !== "4g"));
};

/** Starts buffering as a card comes close, so a tap plays at once. Slow or data-saving connections fetch just the file's header. */
function usePreloadNearby(box: RefObject<HTMLDivElement | null>, video: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const v = video.current;
        if (!entry.isIntersecting || !v) return;
        v.preload = onSlowNetwork() ? "metadata" : "auto";
        observer.disconnect();
      },
      { rootMargin: "30% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [box, video]);
}

/** Touch screens have no hover, so a card plays silently while it is on screen, the way a mouse previews it on a laptop. */
function usePreviewOnScreen(box: RefObject<HTMLDivElement | null>, video: RefObject<HTMLVideoElement | null>, enabled: boolean) {
  useEffect(() => {
    const element = box.current;
    if (!element || !enabled || !matchMedia("(hover: none)").matches || onSlowNetwork()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const v = video.current;
        if (!v) return;
        if (!entry.isIntersecting) return v.pause();
        v.muted = true;
        void v.play().catch(() => {});
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [box, video, enabled]);
}

function Poster({ src, title }: { src: string; title: string }) {
  if (!src) return <span className="pf-poster absolute inset-0 flex items-center justify-center bg-[var(--pf-panel)] p-5 text-center text-3xl text-white/25">{title}</span>;
  // Thumbnails can come from any host, so they skip the image optimiser. They are the whole gallery until someone presses play, so they load straight away.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={`Thumbnail for ${title}`} decoding="async" className="pf-kenburns absolute inset-0 h-full w-full object-cover" />;
}

function Unavailable({ source, title, poster }: { source: ParsedVideo | null; title: string; poster: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--pf-panel)] p-4 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {poster ? <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" /> : null}
      <AlertCircle aria-hidden className="relative h-6 w-6 text-accent" />
      <p className="relative text-sm text-slate-200">{source?.kind === "link" ? `“${title}” opens on its own site.` : "This video isn’t available to play right now."}</p>
      {source ? (
        <a href={source.page} target="_blank" rel="noopener noreferrer" className="relative inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[var(--pf-bg)]">
          Watch on {source.provider === "file" || source.provider === "other" ? "source" : videoProviders[source.provider]} <ExternalLink aria-hidden className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  );
}

/** Stays mounted so a tap can start playback directly. Phones refuse to play with sound any other way. */
function FilePlayer({ source, title, poster, active, busy = false, onStart, onShape }: { source: ParsedVideo; title: string; poster: string } & PlayerProps) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);
  const progress = useMotionValue(0);
  const width = useTransform(progress, (p) => `${p * 100}%`);

  const settle = useStopOffscreen(box, useCallback(() => video.current?.pause(), []));
  usePreloadNearby(box, video);
  usePreviewOnScreen(box, video, !active && !busy);

  // Only one video plays at a time: starting another card pauses this one.
  useEffect(() => {
    if (!active) video.current?.pause();
  }, [active, busy]);

  if (failed) return <Unavailable source={source} title={title} poster={poster} />;

  const start = () => {
    const v = video.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    settle();
    onStart();
    void v.play().catch(() => {});
  };

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };

  const mute = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const fullscreen = () => {
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (box.current?.requestFullscreen) void box.current.requestFullscreen();
    else v?.webkitEnterFullscreen?.();
  };

  return (
    <div
      ref={box}
      className="group/player absolute inset-0 bg-black"
      onPointerEnter={(e) => {
        const v = video.current;
        if (e.pointerType !== "mouse" || active || !v) return;
        v.muted = true;
        void v.play().catch(() => {});
      }}
      onPointerLeave={() => {
        if (active) return;
        video.current?.pause();
      }}
    >
      <video
        ref={video}
        src={source.src}
        preload="none"
        playsInline
        aria-label={title}
        onClick={active ? toggle : undefined}
        onLoadedMetadata={(e) => onShape?.(e.currentTarget.videoHeight > e.currentTarget.videoWidth)}
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          if (!active) setRolling(false);
        }}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => {
          setWaiting(false);
          setRolling(true);
        }}
        onEnded={() => progress.set(0)}
        onError={() => setFailed(true)}
        onTimeUpdate={(e) => progress.set(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
        className={`h-full w-full ${source.vertical ? "object-cover" : "object-contain"}`}
      />
      {/* The thumbnail holds the frame until the first picture is ready, so a tap never shows a black box. */}
      {!rolling ? <Poster src={poster} title={title} /> : null}
      {!active ? <PlayButton title={title} onClick={start} /> : null}
      {active && playing && (waiting || !rolling) ? <Loader2 aria-label="Loading" className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" /> : null}
      {active ? (
        <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2.5 pb-2 pt-9 transition-opacity duration-300 ${playing ? "opacity-0 focus-within:opacity-100 group-hover/player:opacity-100 [@media(hover:none)]:opacity-100" : ""}`}>
          <div
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            onKeyDown={(e) => {
              const v = video.current;
              if (!v) return;
              if (e.key === "ArrowRight") v.currentTime += 5;
              if (e.key === "ArrowLeft") v.currentTime -= 5;
            }}
            onClick={(e) => {
              const v = video.current;
              if (!v?.duration) return;
              const r = e.currentTarget.getBoundingClientRect();
              v.currentTime = ((e.clientX - r.left) / r.width) * v.duration;
            }}
            className="flex h-5 cursor-pointer items-center"
          >
            <span className="h-1 w-full overflow-hidden rounded-full bg-white/25">
              <motion.span style={{ width }} className="block h-full bg-accent" />
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-white">
            <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/15">
              {playing ? <Pause aria-hidden className="h-4 w-4 fill-current" /> : <Play aria-hidden className="h-4 w-4 fill-current" />}
            </button>
            <button onClick={mute} aria-label={muted ? "Unmute" : "Mute"} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/15">
              {muted ? <VolumeX aria-hidden className="h-4 w-4" /> : <Volume2 aria-hidden className="h-4 w-4" />}
            </button>
            <button onClick={fullscreen} aria-label="Full screen" className="ml-auto flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/15">
              <Maximize aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EmbedPlayer({ source, title, poster, active, onStart }: { source: ParsedVideo; title: string; poster: string } & PlayerProps) {
  const box = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [stopped, setStopped] = useState(false);
  // A provider's player can't be paused from here, so it is closed instead.
  const settle = useStopOffscreen(box, useCallback(() => setStopped(true), []));

  if (!active || stopped) {
    return (
      <div ref={box} className="absolute inset-0 bg-black">
        <Poster src={poster} title={title} />
        <PlayButton
          title={title}
          onClick={() => {
            settle();
            setStopped(false);
            onStart();
          }}
        />
      </div>
    );
  }
  return (
    <div ref={box} className="absolute inset-0">
      {!loaded ? <Loader2 aria-label="Loading" className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" /> : null}
      <iframe src={source.src} title={title} allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen onLoad={() => setLoaded(true)} className={`absolute inset-0 h-full w-full border-0 ${source.provider === "instagram" ? "bg-white" : "bg-black"}`} />
    </div>
  );
}

/** Fills its positioned parent. Picks our own player, the provider's embed, or a link out. */
export function VideoPlayer({ video, active, busy, onStart, onShape }: { video: PlayerVideo } & PlayerProps) {
  const source = parseVideoUrl(video.videoUrl);
  const poster = videoPoster(video);
  if (!source || source.kind === "link") return <Unavailable source={source} title={video.title} poster={poster} />;
  if (source.kind === "file") return <FilePlayer source={source} title={video.title} poster={poster} active={active} busy={busy} onStart={onStart} onShape={onShape} />;
  return <EmbedPlayer source={source} title={video.title} poster={poster} active={active} onStart={onStart} />;
}
