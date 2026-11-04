import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "praxera_admin";
const SESSION_DAYS = 30;

const password = () => process.env.ADMIN_PASSWORD || "";

export const adminConfigured = () => !!password();

const sha256 = (s: string) => createHash("sha256").update(s).digest();

function equal(a: string, b: string) {
  return timingSafeEqual(sha256(a), sha256(b));
}

/** Signed with the password, so changing ADMIN_PASSWORD signs out every device. */
const sign = (expires: string) => createHmac("sha256", password()).update(`admin:${expires}`).digest("hex");

export function passwordMatches(attempt: string) {
  return adminConfigured() && equal(attempt, password());
}

export async function startSession() {
  const expires = String(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const [expires, signature] = (await cookies()).get(COOKIE)?.value.split(".") ?? [];
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return equal(signature, sign(expires));
}
