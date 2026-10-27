import { regionForCountry } from "@/content/pricing";

/**
 * Returns the visitor's country as reported by the hosting platform's edge
 * (Vercel or Cloudflare). No IP address is stored or sent to third parties.
 */
export async function GET(request: Request) {
  const raw =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code");
  const country = raw && /^[A-Za-z]{2}$/.test(raw) && raw.toUpperCase() !== "XX" ? raw.toUpperCase() : null;
  return Response.json(
    { country, region: regionForCountry(country) },
    { headers: { "Cache-Control": "private, no-store", Vary: "x-vercel-ip-country, cf-ipcountry" } },
  );
}
