/** Works out how a pasted video link can be played. Shared by the admin form and the public player. */

export const videoProviders = {
  file: "Direct video file",
  cloudinary: "Cloudinary",
  youtube: "YouTube",
  vimeo: "Vimeo",
  drive: "Google Drive",
  instagram: "Instagram",
  other: "Other link",
} as const;

export type VideoProvider = keyof typeof videoProviders;

export type ParsedVideo = {
  provider: VideoProvider;
  /** file: plays in our own player. embed: plays in the provider's iframe. link: can only be opened on its own site. */
  kind: "file" | "embed" | "link";
  src: string;
  page: string;
  poster?: string;
  vertical: boolean;
};

const FILE = /\.(mp4|m4v|webm|mov)$/i;

const onHost = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`);

/** Files bundled with the site, used by the starter videos. */
const isBundled = (raw: string) => /^\/portfolio\/[\w.-]+$/.test(raw);

export function parseVideoUrl(raw: string): ParsedVideo | null {
  const input = raw.trim();
  if (isBundled(input)) return { provider: "file", kind: "file", src: input, page: input, vertical: true };

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password) return null;

  const host = url.hostname.toLowerCase();
  const parts = url.pathname.split("/").filter(Boolean);
  const page = url.href;

  if (onHost(host, "instagram.com")) {
    const at = parts.findIndex((p) => ["reel", "reels", "p", "tv"].includes(p));
    const id = at >= 0 ? parts[at + 1] : undefined;
    if (!id || !/^[\w-]+$/.test(id)) return { provider: "instagram", kind: "link", src: page, page, vertical: true };
    const type = parts[at] === "reels" ? "reel" : parts[at];
    return {
      provider: "instagram",
      kind: "embed",
      src: `https://www.instagram.com/${type}/${id}/embed/`,
      page: `https://www.instagram.com/${type}/${id}/`,
      vertical: true,
    };
  }

  if (onHost(host, "youtube.com") || host === "youtu.be" || onHost(host, "youtube-nocookie.com")) {
    const short = parts[0] === "shorts";
    const id = host === "youtu.be" ? parts[0] : ["shorts", "embed", "live"].includes(parts[0]) ? parts[1] : url.searchParams.get("v");
    if (!id || !/^[\w-]{6,20}$/.test(id)) return { provider: "youtube", kind: "link", src: page, page, vertical: false };
    return {
      provider: "youtube",
      kind: "embed",
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      page: `https://www.youtube.com/watch?v=${id}`,
      poster: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      vertical: short,
    };
  }

  if (onHost(host, "vimeo.com")) {
    const ids = host === "player.vimeo.com" ? parts.slice(1) : parts;
    const id = ids.find((p) => /^\d+$/.test(p));
    if (!id) return { provider: "vimeo", kind: "link", src: page, page, vertical: false };
    const after = ids[ids.indexOf(id) + 1];
    const hash = url.searchParams.get("h") ?? (after && /^[\da-f]+$/i.test(after) ? after : null);
    return {
      provider: "vimeo",
      kind: "embed",
      src: `https://player.vimeo.com/video/${id}?autoplay=1${hash ? `&h=${hash}` : ""}`,
      page,
      vertical: false,
    };
  }

  if (host === "drive.google.com" || host === "docs.google.com") {
    const id = parts[0] === "file" ? parts[2] : url.searchParams.get("id");
    if (!id || !/^[\w-]{10,}$/.test(id)) return { provider: "drive", kind: "link", src: page, page, vertical: false };
    return {
      provider: "drive",
      kind: "embed",
      src: `https://drive.google.com/file/d/${id}/preview`,
      page: `https://drive.google.com/file/d/${id}/view`,
      poster: `https://drive.google.com/thumbnail?id=${id}&sz=w1280`,
      vertical: false,
    };
  }

  if (host === "res.cloudinary.com" && parts.includes("video") && parts.includes("upload")) {
    return {
      provider: "cloudinary",
      kind: "file",
      src: page,
      page,
      poster: `${url.origin}${url.pathname.replace(/(\.\w+)?$/, ".jpg")}`,
      vertical: false,
    };
  }

  if (FILE.test(url.pathname)) return { provider: "file", kind: "file", src: page, page, vertical: false };

  return { provider: "other", kind: "link", src: page, page, vertical: false };
}
