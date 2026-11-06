import { cache } from "react";
import { db, dbConfigured } from "@/lib/db";
import { starterVideos, type PortfolioVideo, type VideoCategory } from "@/content/portfolio";

type Row = {
  id: string;
  title: string;
  description: string;
  category: VideoCategory;
  thumbnail_url: string;
  source_type: string;
  video_url: string;
  featured: boolean;
  display_order: number;
  published: boolean;
};

export type VideoFields = Omit<PortfolioVideo, "id">;

const toVideo = (r: Row): PortfolioVideo => ({
  id: r.id,
  title: r.title,
  description: r.description,
  category: r.category,
  thumbnailUrl: r.thumbnail_url,
  sourceType: r.source_type,
  videoUrl: r.video_url,
  featured: r.featured,
  displayOrder: r.display_order,
  published: r.published,
});

async function insert(sql: Awaited<ReturnType<typeof db>>, v: VideoFields) {
  await sql`
    INSERT INTO portfolio_videos (title, description, category, thumbnail_url, source_type, video_url, featured, display_order, published)
    VALUES (${v.title}, ${v.description}, ${v.category}, ${v.thumbnailUrl}, ${v.sourceType}, ${v.videoUrl}, ${v.featured}, ${v.displayOrder}, ${v.published})`;
}

let tableReady: Promise<unknown> | undefined;

/** The starter videos go in only when the table is first created, so deleting them is permanent. */
async function videosDb() {
  const sql = await db();
  tableReady ??= (async () => {
    const [{ existing }] = (await sql`SELECT to_regclass('portfolio_videos') AS existing`) as { existing: string | null }[];
    if (existing) return;
    await sql`
      CREATE TABLE portfolio_videos (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        title text NOT NULL,
        description text NOT NULL DEFAULT '',
        category text NOT NULL,
        thumbnail_url text NOT NULL DEFAULT '',
        source_type text NOT NULL,
        video_url text NOT NULL,
        featured boolean NOT NULL DEFAULT false,
        display_order integer NOT NULL DEFAULT 0,
        published boolean NOT NULL DEFAULT false
      )`;
    for (const v of starterVideos) await insert(sql, v);
  })().catch((err) => {
    tableReady = undefined;
    throw err;
  });
  await tableReady;
  return sql;
}

export async function listVideos() {
  const sql = await videosDb();
  const rows = await sql`SELECT * FROM portfolio_videos ORDER BY display_order, created_at`;
  return (rows as Row[]).map(toVideo);
}

export async function getVideo(id: string) {
  const sql = await videosDb();
  const rows = await sql`SELECT * FROM portfolio_videos WHERE id = ${id}::uuid`;
  return rows[0] ? toVideo(rows[0] as Row) : null;
}

export async function createVideo(v: VideoFields) {
  await insert(await videosDb(), v);
}

export async function updateVideo(id: string, v: VideoFields) {
  const sql = await videosDb();
  await sql`
    UPDATE portfolio_videos SET title = ${v.title}, description = ${v.description}, category = ${v.category},
      thumbnail_url = ${v.thumbnailUrl}, source_type = ${v.sourceType}, video_url = ${v.videoUrl},
      featured = ${v.featured}, display_order = ${v.displayOrder}, published = ${v.published}
    WHERE id = ${id}::uuid`;
}

export async function setVideoFlag(id: string, flag: "featured" | "published", value: boolean) {
  const sql = await videosDb();
  if (flag === "featured") await sql`UPDATE portfolio_videos SET featured = ${value} WHERE id = ${id}::uuid`;
  else await sql`UPDATE portfolio_videos SET published = ${value} WHERE id = ${id}::uuid`;
}

/** Swaps a video with its neighbour, then renumbers so older equal orders cannot get stuck. */
export async function moveVideo(id: string, direction: -1 | 1) {
  const sql = await videosDb();
  const ids = (await listVideos()).map((v) => v.id);
  const from = ids.indexOf(id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= ids.length) return;
  [ids[from], ids[to]] = [ids[to], ids[from]];
  await sql`
    UPDATE portfolio_videos AS v SET display_order = n.ord
    FROM unnest(${ids}::uuid[]) WITH ORDINALITY AS n(id, ord)
    WHERE v.id = n.id`;
}

export async function deleteVideo(id: string) {
  const sql = await videosDb();
  await sql`DELETE FROM portfolio_videos WHERE id = ${id}::uuid`;
}

const starters = () => starterVideos.map((v, i) => ({ ...v, id: `starter-${i}` }));

/** Never throws: the public page falls back to the starter videos if the database is unavailable. */
export const publicVideos = cache(async (): Promise<PortfolioVideo[]> => {
  if (!dbConfigured()) return starters();
  try {
    const published = (await listVideos()).filter((v) => v.published);
    return [...published.filter((v) => v.featured), ...published.filter((v) => !v.featured)];
  } catch {
    return starters();
  }
});
