import type { Metadata } from "next";
import { ArrowUpRight, Globe } from "lucide-react";
import { Mark, Wordmark } from "@/components/layout/Wordmark";
import { FormIntro } from "@/components/requirements/FormIntro";
import { RequirementsForm } from "@/components/requirements/RequirementsForm";
import { WorkBackdrop } from "@/components/requirements/WorkBackdrop";

export const metadata: Metadata = {
  title: "Project requirements form",
  description: "Tell Praxera Technologies about your business and the problem you want to solve.",
  // Sent to clients directly: never listed in the menu, the sitemap or search results.
  robots: { index: false, follow: false },
};

const linkCls =
  "group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/25 bg-midnight-950/40 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition-colors hover:border-accent hover:text-accent sm:gap-2 sm:px-4 sm:text-sm";

export default function RequirementsPage() {
  return (
    <div data-bare className="on-dark relative min-h-dvh bg-midnight-950 text-white">
      <WorkBackdrop />
      <div className="relative flex min-h-dvh flex-col">
        <header className="mx-auto flex h-14 w-full max-w-7xl shrink-0 items-center justify-between gap-2 px-4 lg:h-20 lg:px-8">
          <span aria-label="Praxera Technologies" className="shrink-0">
            <span className="sm:hidden">
              <Mark className="h-8 w-8" />
            </span>
            <span className="hidden sm:block">
              <Wordmark tone="dark" />
            </span>
          </span>
          <nav aria-label="About Praxera" className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className={linkCls}>
              <Globe aria-hidden className="h-3.5 w-3.5" /> Visit praxera.in
            </a>
            <a href="/case-studies" target="_blank" rel="noopener noreferrer" className={linkCls}>
              See our case studies
              <ArrowUpRight aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </nav>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,38rem)] lg:gap-16 lg:px-8 lg:pb-8">
          <div className="px-4 pb-4 pt-1 lg:sticky lg:top-24 lg:self-start lg:px-0 lg:pt-12">
            <FormIntro />
          </div>
          <RequirementsForm />
        </main>
      </div>
    </div>
  );
}
