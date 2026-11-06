"use server";

import { del } from "@vercel/blob";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isAdmin } from "@/lib/adminAuth";
import { videoCategories } from "@/content/portfolio";
import { parseVideoUrl, videoProviders, type ParsedVideo } from "@/lib/videoSource";
import { createVideo, deleteVideo, getVideo, moveVideo as move, setVideoFlag, updateVideo } from "@/lib/videos";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const imageUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => !v || /^https:\/\//.test(v) || /^\/portfolio\/[\w.-]+$/.test(v), "Use a full https:// image link.");

const schema = z.object({
  title: z.string().trim().min(2, "Please add a title.").max(120, "Please shorten the title."),
  description: z.string().trim().max(600, "Please keep the description under 600 characters."),
  category: z.enum(videoCategories, { error: "Please choose a category." }),
  thumbnailUrl: imageUrl,
  sourceType: z.string(),
  videoUrl: z.string().trim().min(1, "Please paste a video link or upload a file.").max(1000),
  featured: z.boolean(),
  displayOrder: z.coerce.number({ error: "Display order must be a number." }).int("Display order must be a whole number.").min(0).max(9999),
  published: z.boolean(),
});

/** Server actions are public endpoints, so each one checks the session itself. */
async function requireId(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const id = String(form.get("id") ?? "");
  if (!UUID.test(id)) throw new Error("Invalid id");
  return id;
}

async function vimeoThumbnail(page: string) {
  try {
    const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(page)}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return "";
    const data = (await res.json()) as { thumbnail_url?: string };
    return data.thumbnail_url?.startsWith("https://") ? data.thumbnail_url : "";
  } catch {
    return "";
  }
}

const autoThumbnail = async (v: ParsedVideo) => v.poster ?? (v.provider === "vimeo" ? await vimeoThumbnail(v.page) : "");

/** Removes a file from our storage. Links to other hosts are left alone. */
async function removeStored(url: string | undefined) {
  if (!url || !process.env.BLOB_READ_WRITE_TOKEN || !new URL(url, "https://x").hostname.endsWith(".blob.vercel-storage.com")) return;
  await del(url).catch(() => {});
}

export async function saveVideo(_prev: string, form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const id = String(form.get("id") ?? "");
  if (id && !UUID.test(id)) return "This video could not be found.";

  const parsed = schema.safeParse({
    title: form.get("title"),
    description: form.get("description") ?? "",
    category: form.get("category"),
    thumbnailUrl: form.get("thumbnailUrl") ?? "",
    sourceType: form.get("sourceType") ?? "auto",
    videoUrl: form.get("videoUrl"),
    featured: form.get("featured") === "on",
    displayOrder: form.get("displayOrder") || 0,
    published: form.get("status") === "published",
  });
  if (!parsed.success) return parsed.error.issues[0].message;
  const v = parsed.data;

  const source = parseVideoUrl(v.videoUrl);
  if (!source) return "That video link is not valid. It must be a full https:// link.";
  if (v.sourceType !== "auto" && v.sourceType !== source.provider) {
    return `That link looks like ${videoProviders[source.provider]}, not ${videoProviders[v.sourceType as keyof typeof videoProviders] ?? v.sourceType}. Choose Auto-detect or fix the link.`;
  }

  const fields = { ...v, sourceType: source.provider, thumbnailUrl: v.thumbnailUrl || (await autoThumbnail(source)) };
  try {
    if (id) {
      const old = await getVideo(id);
      if (!old) return "This video could not be found.";
      await updateVideo(id, fields);
      if (old.videoUrl !== fields.videoUrl) await removeStored(old.videoUrl);
      if (old.thumbnailUrl !== fields.thumbnailUrl) await removeStored(old.thumbnailUrl);
    } else {
      await createVideo(fields);
    }
  } catch {
    return "The video could not be saved. Please try again.";
  }
  redirect("/admin/videos");
}

export async function toggleFlag(form: FormData) {
  const id = await requireId(form);
  const flag = form.get("flag");
  if (flag !== "featured" && flag !== "published") return;
  await setVideoFlag(id, flag, form.get("value") === "true");
  refresh();
}

export async function reorder(form: FormData) {
  const id = await requireId(form);
  await move(id, form.get("direction") === "up" ? -1 : 1);
  refresh();
}

export async function removeVideo(form: FormData) {
  const id = await requireId(form);
  const video = await getVideo(id);
  await deleteVideo(id);
  await removeStored(video?.videoUrl);
  await removeStored(video?.thumbnailUrl);
  refresh();
}
