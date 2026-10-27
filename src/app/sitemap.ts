import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { callList, leadKaro } from "@/content/caseStudies";

const paths = ["/", "/services", "/case-studies", callList.href, leadKaro.href, "/about", "/pricing", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  return paths.map((p) => ({
    url: `${site.url}${p === "/" ? "" : p}`,
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : p.startsWith("/case-studies") || p === "/services" ? 0.8 : 0.5,
  }));
}
