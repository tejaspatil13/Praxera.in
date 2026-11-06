import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Star } from "lucide-react";
import { reorder, toggleFlag } from "./actions";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { DeleteVideoButton } from "@/components/admin/VideoForm";
import { isAdmin } from "@/lib/adminAuth";
import { dbConfigured } from "@/lib/db";
import { listVideos } from "@/lib/videos";
import { parseVideoUrl, videoProviders } from "@/lib/videoSource";
import type { PortfolioVideo } from "@/content/portfolio";

const iconBtn = "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-slate-600 transition-colors hover:border-accent-strong hover:text-midnight-900 disabled:opacity-30 disabled:hover:border-line disabled:hover:text-slate-600";

function Move({ id, direction, disabled }: { id: string; direction: "up" | "down"; disabled: boolean }) {
  const Icon = direction === "up" ? ArrowUp : ArrowDown;
  return (
    <form action={reorder}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="direction" value={direction} />
      <button className={iconBtn} disabled={disabled} aria-label={`Move ${direction}`}>
        <Icon aria-hidden className="h-4 w-4" />
      </button>
    </form>
  );
}

function Flag({ video, flag }: { video: PortfolioVideo; flag: "featured" | "published" }) {
  const on = video[flag];
  const label = flag === "featured" ? (on ? "Unfeature" : "Feature") : on ? "Unpublish" : "Publish";
  return (
    <form action={toggleFlag}>
      <input type="hidden" name="id" value={video.id} />
      <input type="hidden" name="flag" value={flag} />
      <input type="hidden" name="value" value={String(!on)} />
      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-accent-strong hover:text-midnight-900">{label}</button>
    </form>
  );
}

async function Videos() {
  await connection();
  if (!(await isAdmin())) redirect("/admin");
  if (!dbConfigured()) {
    return (
      <AdminNotice title="Connect the database">
        Video management uses the same Neon database as requirements. In Vercel, open this project’s Storage tab, create the database and connect
        it, then redeploy. Until then, /portfolio shows your starter videos.
      </AdminNotice>
    );
  }

  const videos = await listVideos();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-midnight-900">Video Portfolio Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            {videos.filter((v) => v.published).length} published of {videos.length}. Featured videos appear first.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/portfolio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-midnight-900 hover:border-accent-strong">
            <ExternalLink aria-hidden className="h-4 w-4" /> View portfolio
          </a>
          <Link href="/admin/videos/edit" className="inline-flex items-center gap-2 rounded-full bg-midnight-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-midnight-700">
            <Plus aria-hidden className="h-4 w-4" /> Add video
          </Link>
        </div>
      </div>

      {videos.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-line bg-white p-8 text-center text-slate-600">No videos yet. Add your first one above.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {videos.map((v, i) => (
            <li key={v.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-3 shadow-card sm:flex-nowrap">
              {/* Thumbnails can come from any host, so they skip the image optimiser. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {v.thumbnailUrl ? <img src={v.thumbnailUrl} alt="" loading="lazy" className="h-20 w-14 shrink-0 rounded-lg bg-mist object-cover" /> : <span className="h-20 w-14 shrink-0 rounded-lg bg-mist-2" />}
              <div className="min-w-0 flex-1 basis-40">
                <p className="flex items-center gap-1.5 font-semibold text-midnight-900">
                  {v.featured ? <Star aria-label="Featured" className="h-4 w-4 shrink-0 fill-warn text-warn" /> : null}
                  <span className="truncate">{v.title}</span>
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {v.category} · {videoProviders[parseVideoUrl(v.videoUrl)?.provider ?? "other"]}
                </p>
                <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${v.published ? "bg-accent-soft text-accent-deep" : "bg-mist-2 text-slate-600"}`}>
                  {v.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Flag video={v} flag="published" />
                <Flag video={v} flag="featured" />
                <Move id={v.id} direction="up" disabled={i === 0} />
                <Move id={v.id} direction="down" disabled={i === videos.length - 1} />
                <Link href={`/admin/videos/edit?id=${v.id}`} aria-label={`Edit ${v.title}`} className={iconBtn}>
                  <Pencil aria-hidden className="h-4 w-4" />
                </Link>
                <DeleteVideoButton id={v.id} title={v.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function VideosPage() {
  return (
    <Suspense>
      <Videos />
    </Suspense>
  );
}
