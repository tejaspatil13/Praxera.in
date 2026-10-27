import { PageHero } from "./PageHero";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} intro={`Last updated ${updated}`} />
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="max-w-3xl space-y-6 leading-relaxed text-slate-700 [&_a]:font-medium [&_a]:text-accent-strong [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-midnight-900 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
