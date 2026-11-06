import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/adminAuth";
import { blobConfigured } from "@/lib/videos";

const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MB = 1024 * 1024;

/** Hands the browser a short-lived upload link, so large files go straight to storage instead of through this server. */
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Please sign in again." }, { status: 401 });
  if (!blobConfigured()) return Response.json({ error: "File storage is not connected." }, { status: 503 });

  try {
    const body = (await request.json()) as HandleUploadPresignedBody;
    const result = await handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname, clientPayload) => {
        if (!pathname.startsWith("portfolio/")) throw new Error("Invalid upload path.");
        const video = clientPayload === "video";
        const limits = { allowedContentTypes: video ? VIDEO_TYPES : IMAGE_TYPES, maximumSizeInBytes: (video ? 500 : 8) * MB };
        const token = await issueSignedToken({ pathname, operations: ["put"], validUntil: Date.now() + 60 * 60 * 1000, ...limits });
        return { token, urlOptions: { ...limits, addRandomSuffix: true, allowOverwrite: false } };
      },
    });
    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Upload failed." }, { status: 400 });
  }
}
