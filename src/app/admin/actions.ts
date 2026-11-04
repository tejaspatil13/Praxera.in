"use server";

import { headers } from "next/headers";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, isAdmin, passwordMatches, startSession } from "@/lib/adminAuth";
import { deleteRequirement, setRequirementNotes, setRequirementStatus } from "@/lib/db";
import { isStatus } from "@/lib/requirements";
import { rateLimit } from "@/lib/rateLimit";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Server actions are public endpoints, so each one checks the session itself. */
async function requireId(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const id = String(form.get("id") ?? "");
  if (!UUID.test(id)) throw new Error("Invalid id");
  return id;
}

export async function login(_prev: string, form: FormData) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`admin-login:${ip}`)) return "Too many attempts. Please wait 10 minutes.";
  if (!passwordMatches(String(form.get("password") ?? ""))) return "That password is not correct.";
  await startSession();
  return "";
}

export async function logout() {
  await endSession();
}

export async function updateStatus(form: FormData) {
  const id = await requireId(form);
  const status = form.get("status");
  if (!isStatus(status)) return;
  await setRequirementStatus(id, status);
  refresh();
}

export async function updateNotes(form: FormData) {
  const id = await requireId(form);
  await setRequirementNotes(id, String(form.get("notes") ?? "").slice(0, 10_000));
  refresh();
}

export async function removeRequirement(form: FormData) {
  const id = await requireId(form);
  await deleteRequirement(id);
  redirect("/admin");
}
