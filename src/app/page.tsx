import type { Metadata } from "next";
import { Check, X, ExternalLink } from "lucide-react";
import { HomeHero } from "@/components/home/HomeHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ButtonLink, TextLink } from "@/components/ui/ButtonLink";
import { CountUp } from "@/components/ui/CountUp";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Screenshot } from "@/components/case-studies/Screenshot";
import { ProcessSteps } from "@/components/visuals/ProcessSteps";
import { LeadFlow } from "@/components/visuals/LeadFlow";
import { PricingCards } from "@/components/pricing/PricingCards";
import { problems } from "@/content/problems";
import { services } from "@/content/services";
import { fit } from "@/content/process";
import { callList, leadKaro } from "@/content/caseStudies";
import { site } from "@/content/site";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: canonical("/"),
};

export default function HomePage() {
  const { demo } = callList;
  return (
    <>
      <HomeHero />

      {/* Problems */}
      <Section tone="white" id="problems">
        <SectionHeading
          eyebrow="The problem"
          title="Does any of this sound like your week?"
          intro="Most operational drag is not one big problem. It is dozens of small, repetitive tasks that quietly take hours from capable people."
        />
        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {problems.map((p, i) => (
            <RevealItem key={p.title} className="group bg-white p-6 transition-colors duration-300 hover:bg-mist">
              <p className="font-mono text-xs text-slate-400">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display text-[1.05rem] font-bold leading-snug text-midnight-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <p className="text-slate-600">Recognise one of these? That is usually where to start.</p>
          <TextLink href="/contact?interest=assessment">Request an Automation Assessment</TextLink>
        </Reveal>
      </Section>

      {/* Services */}
      <Section tone="mist" id="services">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="What we do"
            title="Practical technology for the way your business actually runs."
            intro="Not just chatbots. We automate processes, connect systems, and build the software and AI tools your team needs."
          />
          <Reveal>
            <ButtonLink href="/services" variant="secondary">
              All services in detail
            </ButtonLink>
          </Reveal>
        </div>
        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <RevealItem key={s.id}>
              <ServiceCard service={s} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Featured case study */}
      <Section tone="dark" id="work">
        <div aria-hidden className="grid-fade pointer-events-none absolute inset-0" />
        <div className="relative grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading tone="dark" eyebrow="Featured case study" title={callList.title} intro={callList.summary} />
            <Reveal delay={0.1} className="mt-10">
              <p className="eyebrow text-slate-400">Demonstrated result · {demo.context}</p>
              <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                <div>
                  <dt className="text-xs leading-snug text-slate-400">Properties checked</dt>
                  <dd className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                    <CountUp value={demo.propertiesChecked} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs leading-snug text-slate-400">Phone numbers found</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-accent sm:text-3xl">
                    <CountUp value={demo.phoneNumbersFound} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs leading-snug text-slate-400">Search to results</dt>
                  <dd className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                    <CountUp value={demo.secondsToResults} decimals={1} suffix="s" />
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-slate-400">
                Figures from one demonstrated search, not a guarantee for every area. The documented manual baseline is{" "}
                {callList.manualBaseline}.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={callList.href}>Read the case study</ButtonLink>
              <ButtonLink href="/contact?interest=lead-research" variant="ghost">
                Ask About a Similar Workflow
              </ButtonLink>
            </Reveal>
          </div>
          <Reveal delay={0.1} y={28} className="lg:col-span-7">
            <Screenshot
              shot={callList.screenshots.search}
              caption="Genuine capture from the delivered tool: one search returns every listed property with its matched number."
            />
          </Reveal>
        </div>
      </Section>

      {/* Second project */}
      <Section tone="white" id="leadkaro">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={`Case study · ${leadKaro.tag}`} title={leadKaro.name} intro={leadKaro.summary} />
            <Reveal delay={0.1} className="mt-6 text-slate-600">
              <p>
                Lead research, list-building and first-contact messaging in one flow — the kind of sales workflow we build
                for businesses that sell locally.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href={leadKaro.href} variant="dark">
                Read the case study
              </ButtonLink>
              <TextLink href={leadKaro.liveUrl} external>
                Live demo
              </TextLink>
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:pt-4">
            <LeadFlow tone="light" layout="stack" />
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section tone="mist" id="process">
        <SectionHeading
          eyebrow="How we work"
          title="A clear process, agreed before anything is built."
          intro="You will know what is being built, what it depends on, and what it costs before implementation starts."
        />
        <div className="mt-16">
          <ProcessSteps />
        </div>
      </Section>

      {/* Fit */}
      <Section tone="white" id="fit">
        <SectionHeading eyebrow="Is this a fit?" title="Who we work best with." />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal className="rounded-2xl border border-line bg-white p-7 shadow-card">
            <h3 className="font-display text-lg font-bold text-midnight-900">A good fit if</h3>
            <ul className="mt-5 space-y-3.5">
              {fit.good.map((g) => (
                <li key={g} className="flex gap-3 text-slate-600">
                  <Check aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" />
                  {g}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="rounded-2xl border border-line bg-mist p-7">
            <h3 className="font-display text-lg font-bold text-midnight-900">Probably not the right fit if</h3>
            <ul className="mt-5 space-y-3.5">
              {fit.notFit.map((g) => (
                <li key={g} className="flex gap-3 text-slate-600">
                  <X aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                  {g}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Engagements */}
      <Section tone="mist" id="engagements">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Ways to work together"
            title="Start small. Scale when it is proven."
            intro="Most clients begin with a focused assessment, then build the automation that offers the clearest return."
          />
          <Reveal>
            <ButtonLink href="/pricing" variant="secondary">
              Pricing and engagements
            </ButtonLink>
          </Reveal>
        </div>
        <div className="mt-14">
          <PricingCards compact />
        </div>
      </Section>

      {/* Founder */}
      <Section tone="white" id="founder">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <div className="on-dark relative overflow-hidden rounded-3xl bg-midnight-900 p-8 text-white sm:p-10">
              <div aria-hidden className="grid-fade pointer-events-none absolute inset-0" />
              <p className="eyebrow relative text-accent">Founder-led</p>
              <p className="relative mt-6 font-display text-3xl font-bold leading-tight">{site.founder.name}</p>
              <p className="relative mt-1 text-slate-300">{site.founder.title}</p>
              <ul className="relative mt-8 space-y-2 text-sm text-slate-300">
                {site.founder.capabilities.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="About Praxera"
              title="You work directly with the person who builds it."
              intro={`Praxera Technologies was founded by ${site.founder.name} to help businesses spend less time on repetitive work. Tejas learns how your business actually runs, finds where hours are being lost, and designs, builds and delivers the system that gives them back.`}
            />
            <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href="/about" variant="dark">
                About the founder
              </ButtonLink>
              <a
                href={site.founder.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong hover:text-midnight-900"
              >
                Founder’s portfolio <ExternalLink aria-hidden className="h-4 w-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Reveal>
          </div>
        </div>
      </Section>

      <CtaBanner
        title="Tell us which process is costing you the most time."
        body="Share how it works today. You will get an honest view of what can be improved — and whether it is worth automating."
        primary={{ href: "/contact", label: "Discuss Your Project" }}
        secondary={{ href: "/contact?interest=assessment", label: "Request an Assessment" }}
      />
    </>
  );
}
