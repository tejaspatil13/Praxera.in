import { dbConfigured, saveRequirement } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { fieldErrors } from "@/lib/enquiry";
import { MIN_FILL_MS, requirementSchema, toAnswers } from "@/lib/requirements";

const MAX_BODY_BYTES = 20_000;

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(`requirements:${ip}`)) {
    return json({ error: "rate_limited", message: "Too many submissions from this connection. Please try again later." }, 429);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "too_large", message: "Your answers are too long." }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid", message: "The form could not be read. Please try again." }, 400);
  }

  const parsed = requirementSchema.safeParse(body);
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    if (errors.website) return json({ error: "rejected", message: "Your form could not be accepted." }, 400);
    return json({ error: "validation", message: "Please check the highlighted fields.", fields: errors }, 422);
  }

  if (Date.now() - parsed.data.startedAt < MIN_FILL_MS) {
    return json({ error: "too_fast", message: "That was very quick — please wait a moment and send again." }, 400);
  }

  // The form still emails the answers, so a missing database never loses a lead.
  if (!dbConfigured()) return json({ ok: false, error: "not_configured" }, 200);

  try {
    await saveRequirement(toAnswers(parsed.data));
  } catch (err) {
    console.error("[requirements] Save failed", err);
    return json({ ok: false, error: "save_failed" }, 502);
  }

  return json({ ok: true }, 200);
}
