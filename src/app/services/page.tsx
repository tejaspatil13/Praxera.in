import type { Metadata } from "next";
import Link from "next/link";
import { Check, Info } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink, TextLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { CurrencyNote } from "@/components/pricing/PricingCards";
import { services } from "@/content/services";
import type { InterestId } from "@/content/interests";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI applications and agents, workflow automation, WhatsApp automation, spreadsheet and data automation, system integrations, custom software, lead research, reporting and consulting.",
  alternates: canonical("/services"),
};

const interestFor: Record<string, InterestId> = {
  "workflow-automation": "automation",
  "ai-applications": "ai-application",
  "whatsapp-automation": "whatsapp",
  "spreadsheet-automation": "data-automation",
  integrations: "integration",
  "custom-software": "custom-software",
  "lead-research": "lead-research",
  reporting: "reporting",
  consulting: "assessment",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Specific solutions for real operational problems."
        intro="Each service starts from the same question: what is your team doing by hand that a well-built system could do reliably for them?"
      >
        <nav aria-label="Services on this page">
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-block rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-slate-200 transition-colors hover:border-accent hover:text-white"
                >
                  {s.shortTitle}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <div className="bg-white">
        <div className="container-page divide-y divide-line">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="grid gap-10 py-16 sm:py-20 lg:grid-cols-12">
                <Reveal className="lg:col-span-5">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-midnight-900 text-accent">
                      <Icon aria-hidden className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-sm text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 id={`${s.id}-title`} className="mt-6 font-display text-2xl font-bold leading-tight text-midnight-900 sm:text-3xl">
                    {s.title}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-slate-600">{s.summary}</p>
                  <p className="mt-4 font-semibold text-accent-strong">{s.outcome}</p>
                </Reveal>
                <Reveal delay={0.08} className="lg:col-span-7 lg:pt-16">
                  <div className="rounded-2xl border border-line bg-mist/60 p-6 sm:p-8">
                    <h3 className="eyebrow text-slate-500">What this can include</h3>
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {s.items.map((item) => (
                        <li key={item} className="flex gap-2.5 text-[0.95rem] text-slate-700">
                          <Check aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {s.note && (
                      <p className="mt-6 flex gap-2.5 rounded-xl border border-warn/20 bg-warn-soft/60 p-4 text-sm leading-relaxed text-slate-700">
                        <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
                        <span>{s.note}</span>
                      </p>
                    )}
                    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <ButtonLink href={`/contact?interest=${interestFor[s.id] ?? "other"}`} variant="dark">
                        Discuss this service
                      </ButtonLink>
                      {s.proof && <TextLink href={s.proof.href}>{s.proof.label}</TextLink>}
                    </div>
                  </div>
                </Reveal>
              </section>
            );
          })}
        </div>
      </div>

      <section className="bg-mist py-16">
        <div className="container-page flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-midnight-900">How pricing works</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Every project is scoped and priced before work starts. Project fees, any monthly support, and third-party
              software or API charges are always shown separately.
            </p>
            <CurrencyNote className="mt-3" />
          </div>
          <Link
            href="/pricing"
            className="shrink-0 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:border-midnight-900"
          >
            View engagement types
          </Link>
        </div>
      </section>

      <CtaBanner
        title="Not sure which service fits?"
        body="Describe the problem rather than the solution. We will suggest the simplest approach that works — including when that means using a tool you already have."
        primary={{ href: "/contact?interest=assessment", label: "Request an Automation Assessment" }}
        secondary={{ href: "/case-studies", label: "Explore Our Case Studies" }}
      />
    </>
  );
}
