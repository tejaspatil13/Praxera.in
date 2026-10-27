import type { Metadata } from "next";
import { site } from "@/content/site";

/** Canonical URL metadata, emitted only once the production domain is configured. */
export function canonical(path: string): Metadata["alternates"] {
  return site.url ? { canonical: path } : undefined;
}
