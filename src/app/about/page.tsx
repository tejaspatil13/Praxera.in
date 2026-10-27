import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { ProcessSteps } from "@/components/visuals/ProcessSteps";
import { principles } from "@/content/process";
import { callList, leadKaro } from "@/content/caseStudies";
import { site } from "@/content/site";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: `Praxera Technologies is a founder-led AI, automation and custom software company founded by ${site.founder.name}.`,
  alternates: canonical("/about"),
};


export default function AboutPage() {
  const { founder } = site;
  return (
    <>
      <PageHero
        eyebrow="About Praxera"
        title="Practical innovation for a new era of business."
        intro="Praxera Technologies builds automation, integrations, AI applications and custom software that make everyday operations simpler — starting from the real problem, not the technology."
      />

      <Section tone="white" id="name">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="The name" title="Praxis, meet era." />
          </div>
          <RevealGroup className="grid gap-5 sm:grid-cols-3 lg:col-span-7">
            {[
              { k: "Praxis", v: "Practical action and applied knowledge — turning ideas into real, working solutions." },
              { k: "Era", v: "A new period of progress, innovation and business transformation." },
              { k: "Technologies", v: "Real software, integrations, automation systems and AI-powered business tools." },
            ].map((x) => (
              <RevealItem key={x.k} className="rounded-2xl border border-line bg-mist/60 p-6">
                <p className="font-display text-xl font-bold text-midnight-900">{x.k}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{x.v}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
        <Reveal className="mt-6 text-xs text-slate-500">
          Praxera is a coined name; this is the meaning behind the brand rather than a dictionary etymology.
        </Reveal>
      </Section>

      <Section tone="mist" id="founder">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="on-dark relative overflow-hidden rounded-3xl bg-midnight-900 p-8 text-white sm:p-10">
              <div aria-hidden className="grid-fade pointer-events-none absolute inset-0" />
              <svg aria-hidden viewBox="0 0 200 120" className="relative h-24 w-40">
                <path d="M10 100 C60 100 60 20 110 20 S160 60 190 60" fill="none" stroke="#2dd4bf" strokeWidth="2" className="flow-line" />
                <circle cx="10" cy="100" r="5" fill="#2dd4bf" />
                <circle cx="110" cy="20" r="5" fill="#ffffff" />
                <circle cx="190" cy="60" r="5" fill="#2dd4bf" />
              </svg>
              <p className="relative mt-6 font-display text-3xl font-bold">{founder.name}</p>
              <p className="relative mt-1 text-slate-300">{founder.title}</p>
              <p className="relative mt-1 text-sm text-slate-400">Based in {founder.location}</p>
              <ul className="relative mt-8 space-y-2.5" aria-label="What the founder does for clients">
                {founder.capabilities.map((c) => (
                  <li key={c} className="flex gap-2.5 text-sm text-slate-200">
                    <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="relative mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                <a href={founder.portfolio} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:text-white">
                  Founder’s portfolio <ArrowUpRight aria-hidden className="h-4 w-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="About the founder"
              title={`${founder.name} — Founder, Praxera Technologies`}
            />
            <Reveal delay={0.1} className="mt-6 space-y-5 text-lg leading-relaxed text-slate-600">
              <p>
                {founder.name} founded Praxera Technologies to help businesses spend less time on repetitive work and more
                on the work that grows them.
              </p>
              <p>
                Every engagement starts with how your business actually runs. Tejas learns the workflow from the people who
                do it, finds where hours are being lost, and turns that into a clear, prioritised plan — recommending a tool
                you already have whenever it is enough.
              </p>
              <p>
                When something needs to be built, the same person designs it, builds it, tests it with your real inputs and
                hands it over with documentation, so you are never passed between teams.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-10">
              <h3 className="eyebrow text-slate-500">Evidence of work</h3>
              <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
                {[
                  { name: callList.shortTitle, href: callList.href },
                  { name: `${leadKaro.name} — Lead generation and WhatsApp outreach`, href: leadKaro.href },
                ].map((p) => (
                  <li key={p.name}>
                    <Link href={p.href} className="flex items-center justify-between gap-4 px-5 py-4 font-medium text-midnight-900 hover:bg-mist">
                      {p.name} <span aria-hidden className="text-accent-strong">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="white" id="principles">
        <SectionHeading
          eyebrow="How we think"
          title="Principles behind every engagement"
          intro="Technology is a means, not the goal. These principles keep the work grounded."
        />
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {principles.map((p, i) => (
            <RevealItem key={p.title} className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <p className="font-mono text-xs text-accent-strong">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display font-bold leading-snug text-midnight-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="mist" id="process">
        <SectionHeading eyebrow="How we work" title="Six steps from first conversation to handover." />
        <div className="mt-16">
          <ProcessSteps />
        </div>
      </Section>

      <CtaBanner
        title="Talk directly with the founder."
        body="Describe the process you want to improve. You will get a straight answer on what is possible."
        primary={{ href: "/contact", label: "Contact the Founder" }}
        secondary={{ href: "/case-studies", label: "Explore Our Case Studies" }}
      />
    </>
  );
}
