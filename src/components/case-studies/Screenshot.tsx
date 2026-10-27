import Image from "next/image";

type Shot = { src: string; width: number; height: number; alt: string };

/** Frames a genuine application capture with a minimal browser chrome. */
export function Screenshot({ shot, caption, eager, sizes = "(min-width: 1024px) 60vw, 100vw", className = "" }: {
  shot: Shot;
  caption?: string;
  eager?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
        <div aria-hidden className="flex items-center gap-1.5 border-b border-line bg-mist px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <Image src={shot.src} width={shot.width} height={shot.height} alt={shot.alt} sizes={sizes} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} className="h-auto w-full" />
      </div>
      {caption && <figcaption className="mt-3 text-sm text-slate-500">{caption}</figcaption>}
    </figure>
  );
}
