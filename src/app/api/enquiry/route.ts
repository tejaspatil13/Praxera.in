import { enquirySchema, enquiryRows, enquirySubject, fieldErrors, MIN_FILL_MS } from "@/lib/enquiry";
import { rateLimit } from "@/lib/rateLimit";
import { site } from "@/content/site";

const MAX_BODY_BYTES = 20_000;


function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const DELIVERY_FAILED = {
  error: "delivery_failed",
  message: "Your enquiry could not be delivered. Please try again shortly.",
};

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(`enquiry:${ip}`)) {
    return json({ error: "rate_limited", message: "Too many enquiries from this connection. Please try again later." }, 429);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "too_large", message: "Your message is too long." }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid", message: "The form could not be read. Please try again." }, 400);
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    if (errors.website) return json({ error: "rejected", message: "Your enquiry could not be accepted." }, 400);
    return json({ error: "validation", message: "Please check the highlighted fields.", fields: errors }, 422);
  }
  const e = parsed.data;

  if (Date.now() - e.startedAt < MIN_FILL_MS) {
    return json({ error: "too_fast", message: "That was very quick — please wait a moment and send again." }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL || site.publicEmail;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !from || !to) {
    // No server-side email provider: the form offers WhatsApp / email hand-off instead.
    // Expected state, not a server failure — the form offers WhatsApp / email hand-off instead.
    return json({ ok: false, error: "not_configured", message: "Server email delivery is not set up." }, 200);
  }

  const rows = enquiryRows(e);

  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nWhat they want to improve:\n${e.message}\n`;
  const html = `<h2 style="font-family:sans-serif">New enquiry — ${escapeHtml(site.name)}</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#63738b">${escapeHtml(k)}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>
<h3 style="font-family:sans-serif">What they want to improve</h3>
<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(e.message)}</p>`;

  const subject = enquirySubject(e);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), reply_to: e.email, subject, text, html }),
    });
    if (!res.ok) {
      console.error("[enquiry] Resend responded", res.status, await res.text().catch(() => ""));
      return json(DELIVERY_FAILED, 502);
    }
  } catch (err) {
    console.error("[enquiry] Delivery error", err);
    return json(DELIVERY_FAILED, 502);
  }

  return json({ ok: true }, 200);
}
