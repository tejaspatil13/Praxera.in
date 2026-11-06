"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { uploadPresigned } from "@vercel/blob/client";
import { AlertCircle, CheckCircle2, Image as ImageIcon, Link2, Loader2, Trash2, Upload } from "lucide-react";
import { removeVideo, saveVideo } from "@/app/admin/videos/actions";
import { videoCategories, type PortfolioVideo } from "@/content/portfolio";
import { parseVideoUrl, videoProviders } from "@/lib/videoSource";

const MB = 1024 * 1024;
const LIMITS = { video: 500 * MB, image: 8 * MB };
const TYPES = { video: ["video/mp4", "video/webm", "video/quicktime"], image: ["image/jpeg", "image/png", "image/webp"] };

const labelCls = "block text-sm font-semibold text-midnight-900";
const inputCls = "mt-1.5 block w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-slate-400 focus:outline-none focus-visible:border-accent-strong focus-visible:ring-2 focus-visible:ring-accent-strong/25";

/** Picks a frame from a video on this computer, so an upload gets a thumbnail without extra work. */
async function frameFrom(file: File) {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.src = url;
  try {
    await new Promise((loaded, failed) => {
      video.onloadeddata = loaded;
      video.onerror = failed;
    });
    video.currentTime = Math.min(1, video.duration / 2);
    await new Promise((seeked) => {
      video.onseeked = seeked;
    });
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 720 / video.videoWidth);
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/jpeg", 0.85));
    return image ? new File([image], "thumbnail.jpg", { type: "image/jpeg" }) : null;
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Uploads straight to storage and reports progress. Returns the file's public link. */
function useFileUpload(kind: keyof typeof LIMITS, onDone: (url: string) => void) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function start(file: File) {
    setError("");
    if (!TYPES[kind].includes(file.type)) {
      setError(kind === "video" ? "Use an MP4, WebM or MOV file." : "Use a JPG, PNG or WebP image.");
      return false;
    }
    if (file.size > LIMITS[kind]) {
      setError(`That file is over the ${LIMITS[kind] / MB} MB limit.`);
      return false;
    }
    setProgress(0);
    // A last progress event can arrive after the upload resolves, and must not reopen the progress bar.
    let finished = false;
    try {
      const blob = await uploadPresigned(`portfolio/${file.name.replace(/[^\w.-]+/g, "-")}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        clientPayload: kind,
        multipart: file.size > 50 * MB,
        onUploadProgress: (p) => {
          if (!finished) setProgress(Math.round(p.percentage));
        },
      });
      finished = true;
      onDone(blob.url);
      setProgress(null);
      return true;
    } catch (err) {
      finished = true;
      setError(err instanceof Error ? err.message : "The upload failed. Please try again.");
      setProgress(null);
      return false;
    }
  }

  return { progress, error, start };
}

function Progress({ value }: { value: number }) {
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress" className="mt-2 h-2 overflow-hidden rounded-full bg-mist-2">
      <div className="h-full bg-accent-strong transition-[width]" style={{ width: `${value}%` }} />
    </div>
  );
}

function UploadButton({ kind, label, onDone }: { kind: keyof typeof LIMITS; label: string; onDone: (url: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const { progress, error, start } = useFileUpload(kind, onDone);
  const busy = progress !== null;
  return (
    <div className="mt-2">
      <input
        ref={input}
        type="file"
        hidden
        accept={TYPES[kind].join(",")}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void start(file);
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-midnight-900 transition-colors hover:border-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Upload aria-hidden className="h-4 w-4" />}
        {busy ? `Uploading ${progress}%` : label}
      </button>
      {busy ? <Progress value={progress} /> : null}
      {error ? <p className="mt-1.5 text-sm text-danger">{error}</p> : null}
    </div>
  );
}

/** The main way to add a video: pick or drop a file, and it is stored and ready to play on the site. */
function VideoUpload({ current, onDone, onBusy, onPicked }: { current: string; onDone: (url: string) => void; onBusy: (busy: boolean) => void; onPicked: (file: File) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [over, setOver] = useState(false);
  const { progress, error, start } = useFileUpload("video", onDone);
  const busy = progress !== null;

  const pick = async (file: File | undefined) => {
    if (!file) return;
    onBusy(true);
    const done = await start(file);
    onBusy(false);
    if (done) {
      setName(file.name);
      onPicked(file);
    }
  };

  return (
    <div className="mt-3">
      <input
        ref={input}
        id="videoFile"
        type="file"
        hidden
        accept={TYPES.video.join(",")}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          void pick(file);
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void pick(e.dataTransfer.files[0]);
        }}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-9 text-center transition-colors disabled:cursor-wait ${over ? "border-accent-strong bg-accent-soft/50" : "border-line bg-mist/60 hover:border-accent-strong"}`}
      >
        {busy ? <Loader2 aria-hidden className="h-7 w-7 animate-spin text-accent-strong" /> : <Upload aria-hidden className="h-7 w-7 text-accent-strong" />}
        <span className="font-semibold text-midnight-900">{busy ? `Uploading ${progress}%` : current ? "Choose a different video" : "Choose a video to upload"}</span>
        <span className="text-sm text-slate-500">{busy ? "Please keep this page open." : "Or drag it here. MP4, WebM or MOV, up to 500 MB."}</span>
      </button>
      {busy ? <Progress value={progress} /> : null}
      {current && !busy ? (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-success">
          <CheckCircle2 aria-hidden className="h-4 w-4" /> {name ? `${name} uploaded.` : "Video uploaded."} It will play directly on your site.
        </p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}

function UploadSetup() {
  return (
    <div className="mt-3 rounded-2xl border border-warn/30 bg-warn-soft/60 p-5 text-sm text-ink">
      <p className="font-semibold">One quick setup is needed before you can upload</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5">
        <li>In Vercel, open this project and go to the Storage tab.</li>
        <li>Create a Blob store with public access and connect it to this project.</li>
        <li>Redeploy the site. This upload box will then appear here.</li>
      </ol>
    </div>
  );
}

function Save({ blocked }: { blocked: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending || blocked} className="inline-flex items-center gap-2 rounded-full bg-midnight-900 px-6 py-3 text-sm font-semibold text-white hover:bg-midnight-700 disabled:opacity-60">
      {pending ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : null} Save video
    </button>
  );
}

export function VideoForm({ video, nextOrder, uploadsEnabled }: { video: PortfolioVideo | null; nextOrder: number; uploadsEnabled: boolean }) {
  const [error, action] = useActionState(saveVideo, "");
  const [videoUrl, setVideoUrl] = useState(video?.videoUrl ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(video?.thumbnailUrl ?? "");
  const [sourceType, setSourceType] = useState("auto");
  const [uploading, setUploading] = useState(false);
  const source = videoUrl.trim() ? parseVideoUrl(videoUrl) : undefined;
  const [mode, setMode] = useState<"upload" | "link">(!video || source?.provider === "file" ? "upload" : "link");
  const thumbnail = useFileUpload("image", setThumbnailUrl);
  const needsThumbnail = source && !thumbnailUrl && !source.poster && source.provider !== "vimeo";
  const preview = thumbnailUrl || source?.poster;

  return (
    <form action={action} className="mt-6 space-y-5 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
      {video ? <input type="hidden" name="id" value={video.id} /> : null}

      <div>
        <label htmlFor="title" className={labelCls}>Video title</label>
        <input id="title" name="title" required maxLength={120} defaultValue={video?.title} className={inputCls} />
      </div>

      <div>
        <label htmlFor="description" className={labelCls}>Video description <span className="font-normal text-slate-500">(optional)</span></label>
        <textarea id="description" name="description" rows={3} maxLength={600} defaultValue={video?.description} className={inputCls} />
      </div>

      <div>
        <label htmlFor="category" className={labelCls}>Video category</label>
        <select id="category" name="category" defaultValue={video?.category ?? videoCategories[0]} className={inputCls}>
          {videoCategories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className={labelCls}>Video</legend>
        <div role="group" aria-label="How to add the video" className="mt-1.5 grid grid-cols-2 gap-1 rounded-xl bg-mist-2 p-1">
          {(
            [
              ["upload", "Upload a video", Upload],
              ["link", "Paste a link", Link2],
            ] as const
          ).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => {
                setMode(value);
                if (value === "upload" && source?.provider !== "file") setVideoUrl("");
              }}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${mode === value ? "bg-white text-midnight-900 shadow-sm" : "text-slate-600 hover:text-midnight-900"}`}
            >
              <Icon aria-hidden className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {mode === "upload" ? (
          <>
            <input type="hidden" name="videoUrl" value={videoUrl} />
            <input type="hidden" name="sourceType" value="auto" />
            {uploadsEnabled ? (
              <VideoUpload
                current={videoUrl}
                onDone={setVideoUrl}
                onBusy={setUploading}
                onPicked={(file) => {
                  if (!thumbnailUrl) void frameFrom(file).then((frame) => frame && thumbnail.start(frame));
                }}
              />
            ) : (
              <UploadSetup />
            )}
          </>
        ) : (
          <div className="mt-3 space-y-3">
            <div>
              <label htmlFor="videoUrl" className={labelCls}>Video URL</label>
              <input id="videoUrl" name="videoUrl" required value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Paste a YouTube, Vimeo, Instagram, Cloudinary, Google Drive or .mp4 link" className={inputCls} />
              {source === null ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-danger"><AlertCircle aria-hidden className="h-4 w-4" /> Enter a full https:// link.</p>
              ) : source ? (
                <p className={`mt-1.5 flex items-center gap-1.5 text-sm ${source.kind === "link" || source.provider === "instagram" ? "text-warn" : "text-success"}`}>
                  {source.kind === "link" ? <Link2 aria-hidden className="h-4 w-4" /> : <CheckCircle2 aria-hidden className="h-4 w-4" />}
                  {videoProviders[source.provider]}: {source.kind === "link" ? "can’t play on your site, visitors will get a link to open it." : source.provider === "instagram" ? "Instagram’s player may send visitors to Instagram. Upload the video file so it always plays here." : "plays directly on your site."}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="sourceType" className={labelCls}>Video source type</label>
              <select id="sourceType" name="sourceType" value={sourceType} onChange={(e) => setSourceType(e.target.value)} className={inputCls}>
                <option value="auto">Auto-detect from link</option>
                {Object.entries(videoProviders).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </fieldset>

      <div>
        <label htmlFor="thumbnailUrl" className={labelCls}>Video thumbnail <span className="font-normal text-slate-500">(image link or upload)</span></label>
        <div className="mt-1.5 flex gap-3">
          <span className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-mist-2 text-slate-400">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {preview ? <img src={preview} alt="Thumbnail preview" className="h-full w-full object-cover" /> : <ImageIcon aria-hidden className="h-5 w-5" />}
          </span>
          <div className="min-w-0 flex-1">
            <input id="thumbnailUrl" name="thumbnailUrl" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://…" className={`${inputCls} !mt-0`} />
            {uploadsEnabled ? <UploadButton kind="image" label="Upload thumbnail" onDone={setThumbnailUrl} /> : null}
            {thumbnail.progress !== null ? <p className="mt-1.5 text-sm text-slate-500">Making a thumbnail from your video…</p> : null}
          </div>
        </div>
        {needsThumbnail && mode === "link" ? <p className="mt-1.5 text-sm text-warn">{videoProviders[source.provider]} doesn’t give a thumbnail, so please add one. Otherwise the card shows the title on a plain background.</p> : null}
        {source?.poster && !thumbnailUrl ? <p className="mt-1.5 text-sm text-slate-500">Thumbnail found automatically. Add your own to replace it.</p> : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="displayOrder" className={labelCls}>Display order</label>
          <input id="displayOrder" name="displayOrder" type="number" min={0} max={9999} defaultValue={video?.displayOrder ?? nextOrder} className={inputCls} />
        </div>
        <div>
          <label htmlFor="status" className={labelCls}>Status</label>
          <select id="status" name="status" defaultValue={video && !video.published ? "draft" : "published"} className={inputCls}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <label className="flex items-center gap-3 self-end rounded-xl border border-line px-3.5 py-2.5 text-sm font-semibold text-midnight-900">
          <input type="checkbox" name="featured" defaultChecked={video?.featured} className="h-4 w-4 accent-[var(--color-accent-strong)]" /> Featured video
        </label>
      </div>

      {error ? (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      ) : null}
      <Save blocked={!videoUrl.trim() || source === null || uploading} />
    </form>
  );
}

export function DeleteVideoButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={removeVideo}
      onSubmit={(e) => {
        if (!confirm(`Delete “${title}”? This can’t be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button aria-label={`Delete ${title}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-danger transition-colors hover:border-danger">
        <Trash2 aria-hidden className="h-4 w-4" />
      </button>
    </form>
  );
}
