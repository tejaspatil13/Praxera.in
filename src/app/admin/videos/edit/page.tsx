import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { VideoForm } from "@/components/admin/VideoForm";
import { isAdmin } from "@/lib/adminAuth";
import { dbConfigured } from "@/lib/db";
import { blobConfigured, getVideo, listVideos } from "@/lib/videos";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function Edit({ searchParams }: { searchParams: PageProps<"/admin/videos/edit">["searchParams"] }) {
  await connection();
  if (!(await isAdmin()) || !dbConfigured()) redirect("/admin/videos");
  const { id } = await searchParams;
  if (id !== undefined && (typeof id !== "string" || !UUID.test(id))) notFound();
  const video = id ? await getVideo(id) : null;
  if (id && !video) notFound();
  const nextOrder = video ? 0 : (await listVideos()).reduce((max, v) => Math.max(max, v.displayOrder), 0) + 1;

  return (
    <>
      <Link href="/admin/videos" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-midnight-900">
        <ArrowLeft aria-hidden className="h-4 w-4" /> All videos
      </Link>
      <h1 className="mt-5 font-display text-2xl font-bold text-midnight-900">{video ? "Edit video" : "Add new video"}</h1>
      <VideoForm video={video} nextOrder={nextOrder} uploadsEnabled={blobConfigured()} />
    </>
  );
}

export default function EditVideoPage({ searchParams }: PageProps<"/admin/videos/edit">) {
  return (
    <Suspense>
      <Edit searchParams={searchParams} />
    </Suspense>
  );
}
