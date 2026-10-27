import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Screenshot } from "@/components/case-studies/Screenshot";
import { LeadFlow } from "@/components/visuals/LeadFlow";
import { callList, leadKaro } from "@/content/caseStudies";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real work: automated UK business contact discovery and call-list generation, and LeadKaro, lead generation with AI-written WhatsApp outreach.",
  alternates: canonical("/case-studies"),
};

export default function CaseStudiesPage() {
  const { demo } = callList;
  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Proof from real builds, described plainly."
        intro="Each project below is real work by Praxera’s founder. Results are shown exactly as documented, with their context and limitations."
      />

      <Section tone="white">
        <Reveal>
          <Link
            href={callList.href}
            className="group grid overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-shadow duration-300 hover:shadow-lift lg:grid-cols-12"
          >
            <div className="flex flex-col p-7 sm:p-10 lg:col-span-5">
              <p className="eyebrow text-accent-strong">{callList.label}</p>
              <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-midnight-900 sm:text-3xl">{callList.shortTitle}</h2>
              <p className="mt-4 leading-relaxed text-slate-600">{callList.summary}</p>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
                <div>
                  <dt className="text-xs text-slate-500">Properties checked</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-midnight-900">
                    <CountUp value={demo.propertiesChecked} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Numbers found</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-accent-strong">
                    <CountUp value={demo.phoneNumbersFound} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">To results</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-midnight-900">
                    <CountUp value={demo.secondsToResults} decimals={1} suffix="s" />
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-slate-500">Demonstrated search: {demo.context}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent-strong">
                Read the full case study <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
            <div className="bg-mist p-5 sm:p-8 lg:col-span-7 lg:flex lg:items-center">
              <Screenshot shot={callList.screenshots.sheet} sizes="(min-width: 1024px) 55vw, 100vw" />
            </div>
          </Link>
        </Reveal>

        <Reveal className="mt-8">
          <Link
            href={leadKaro.href}
            className="on-dark group block overflow-hidden rounded-3xl bg-midnight-900 p-7 text-white transition-shadow duration-300 hover:shadow-lift sm:p-10"
          >
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="eyebrow text-accent">{leadKaro.label}</p>
                <h2 className="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl">{leadKaro.name}</h2>
                <p className="mt-4 leading-relaxed text-slate-300">{leadKaro.summary}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent lg:col-span-5 lg:justify-self-end">
                Read the case study <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
            <div className="mt-10">
              <LeadFlow tone="dark" />
            </div>
          </Link>
        </Reveal>
      </Section>

      <CtaBanner
        title="Have a process like these?"
        body="Tell us what your team does by hand today. We will tell you honestly whether it can be automated, and how."
        primary={{ href: "/contact", label: "Discuss Your Project" }}
      />
    </>
  );
}
