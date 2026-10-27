import type { Metadata } from "next";
import { AlertTriangle, Building2, Check, Clock, Info, RefreshCw, ShieldCheck, BarChart3, Scale, SearchCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CountUp } from "@/components/ui/CountUp";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { Screenshot } from "@/components/case-studies/Screenshot";
import { BeforeAfter } from "@/components/visuals/BeforeAfter";
import { DataSourcesDiagram } from "@/components/visuals/DataSourcesDiagram";
import { callList } from "@/content/caseStudies";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Case Study: UK Business Contact Discovery and Call-List Automation",
  description:
    "How a four-step manual prospect-research process became one search: 1,178 properties checked and 1,012 phone numbers found in 2.8 seconds in a demonstrated Coventry CV1 search.",
  alternates: canonical(`/case-studies/${callList.slug}`),
};

const limitationIcons = [RefreshCw, Building2, SearchCheck, ShieldCheck, BarChart3, Scale];

export default function CallListCaseStudy() {
  const { demo, illustrative: il } = callList;
  return (
    <>
      <PageHero
        eyebrow={`Case study · ${callList.label}`}
        title={callList.title}
        intro={callList.summary}
        aside={
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
            <p className="eyebrow text-accent">Demonstrated result</p>
            <p className="mt-2 text-sm text-slate-300">{demo.context}</p>
            <dl className="mt-6 space-y-5">
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                <dt className="text-sm text-slate-300">Properties checked</dt>
                <dd className="font-display text-3xl font-bold">
                  <CountUp value={demo.propertiesChecked} />
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                <dt className="text-sm text-slate-300">Phone numbers found</dt>
                <dd className="font-display text-3xl font-bold text-accent">
                  <CountUp value={demo.phoneNumbersFound} />
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-slate-300">From clicking Search to results</dt>
                <dd className="font-display text-3xl font-bold">
                  <CountUp value={demo.secondsToResults} decimals={1} suffix=" sec" />
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-slate-400">
              Results from one demonstrated search. They are not independently audited and will differ by area.
            </p>
          </div>
        }
      />

      {/* The problem */}
      <Section tone="white" id="problem">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="The problem"
              title="Every contact was found by hand, in four steps."
              intro="A sales team needed call lists of UK businesses. To build them, each caller searched the government business-rates website, copied every property address, looked each one up on Google Maps to find the business and its number, then typed it all into a spreadsheet."
            />
          </div>
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="flex items-start gap-5 rounded-2xl border border-warn/20 bg-warn-soft/50 p-6 sm:p-8">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warn text-white">
                <Clock aria-hidden className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-3xl font-bold text-warn">2–3 hours</p>
                <p className="mt-1 text-slate-700">
                  for one person to build a list of 50–60 contacts — repeated every day. That is time taken directly from
                  sales calls.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-line bg-mist p-6 sm:p-8">
              <p className="eyebrow flex items-center gap-2 text-slate-500">
                <Info aria-hidden className="h-4 w-4" /> Illustrative calculation
              </p>
              <p className="mt-3 text-slate-700">
                For a team of {il.callers} callers each spending {il.hoursPerCaller} hours a day on research:
              </p>
              <dl className="mt-5 grid grid-cols-3 gap-4">
                <div>
                  <dt className="text-xs text-slate-500">Per day</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-midnight-900">{il.perDay} hours</dd>
                  <dd className="text-xs text-slate-500">
                    {il.callers} × {il.hoursPerCaller} hours
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Per week</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-midnight-900">{il.perWeek} hours</dd>
                  <dd className="text-xs text-slate-500">{il.perDay} hours × 5 days</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Equivalent to</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-midnight-900">≈ {il.fullTimeEquivalent} people</dd>
                  <dd className="text-xs text-slate-500">at {il.hoursPerFte} hours a week</dd>
                </div>
              </dl>
              <p className="mt-5 text-xs leading-relaxed text-slate-500">
                This is arithmetic based on the stated manual process, not a measured result for an identified customer.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Before and after */}
      <Section tone="mist" id="before-after">
        <SectionHeading
          eyebrow="Before and after"
          title="Four copy-and-paste steps per contact became one search."
          intro="The tool performs the same research a caller did by hand — for every listed property in the area at once."
        />
        <div className="mt-14">
          <BeforeAfter />
        </div>
      </Section>

      {/* How it works */}
      <Section tone="white" id="how-it-works">
        <SectionHeading
          eyebrow="How it works"
          title="Two public sources, matched and turned into a call list."
          intro="The government rating list says which business properties exist and where. Public business listings supply names and phone numbers. The tool joins them."
        />
        <div className="mt-14">
          <DataSourcesDiagram />
        </div>

        <RevealGroup className="mt-16 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {callList.features.map((f) => (
            <RevealItem key={f.title}>
              <Check aria-hidden className="h-5 w-5 text-accent-strong" />
              <h3 className="mt-3 font-display font-bold text-midnight-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Screenshots */}
      <Section tone="mist" id="screens">
        <SectionHeading
          eyebrow="The delivered tool"
          title="Search exactly like the government site."
          intro="Genuine captures from the working application, as included in the project documentation."
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <Screenshot
              shot={callList.screenshots.search}
              caption="Search results for London EC1V 9LT, offices, £5,000–£50,000: 15 listed properties, 15 with a phone number."
            />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-4">
            <Screenshot
              shot={callList.screenshots.postcodes}
              sizes="(min-width: 1024px) 30vw, 100vw"
              caption="Choosing a town fills the postcode list, with the number of properties in each."
            />
          </Reveal>
          <Reveal className="lg:col-span-8">
            <Screenshot
              shot={callList.screenshots.sheet}
              caption="My sheet: combine many searches into one call list. Duplicates are skipped."
            />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-4">
            <Screenshot
              shot={callList.screenshots.fileName}
              sizes="(min-width: 1024px) 30vw, 100vw"
              caption="The employee’s name becomes the default file name."
            />
          </Reveal>
        </div>
      </Section>

      {/* Excel output */}
      <Section tone="white" id="output">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="The result"
              title="A ready-to-call Excel sheet."
              intro="Only properties with a phone number, in the team’s usual columns. Comments and Status are left empty for callers to fill in."
            />
            <Reveal delay={0.1}>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Excel columns">
                {callList.excelColumns.map((c) => (
                  <li key={c} className="rounded-md border border-line bg-mist px-2.5 py-1 font-mono text-xs text-slate-700">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <Screenshot
              shot={callList.screenshots.excel}
              caption="A real file downloaded from the tool — London EC1V 9LT, offices, rateable value £5,000–£50,000."
            />
          </Reveal>
        </div>
      </Section>

      {/* Comparison table */}
      <Section tone="mist" id="comparison">
        <SectionHeading eyebrow="Side by side" title="What changed for the team" />
        <Reveal className="mt-12 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">Manual process compared with the automated tool</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-2/5 px-6 py-4 font-semibold text-slate-500">
                  <span className="sr-only">Aspect</span>
                </th>
                <th scope="col" className="px-6 py-4 font-display text-base font-bold text-warn">
                  Today (by hand)
                </th>
                <th scope="col" className="px-6 py-4 font-display text-base font-bold text-accent-strong">
                  With the tool
                </th>
              </tr>
            </thead>
            <tbody>
              {callList.comparison.map((r) => (
                <tr key={r.row} className="border-b border-line last:border-0">
                  <th scope="row" className="px-6 py-4 font-semibold text-midnight-900">
                    {r.row}
                  </th>
                  <td className="px-6 py-4 text-slate-600">{r.manual}</td>
                  <td className="px-6 py-4 font-medium text-midnight-900">{r.automated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <p className="mt-4 text-xs text-slate-500">
          “Today” figures describe the team’s stated manual process. Tool figures come from a real search, as documented.
        </p>
      </Section>

      {/* Value & architecture */}
      <Section tone="dark" id="value">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading tone="dark" eyebrow="Business value" title="What the team gets back" />
            <Reveal delay={0.1}>
              <ul className="mt-8 space-y-4">
                {[
                  "Less time spent researching prospects by hand",
                  "More structured, consistent contact data",
                  "Far less repetitive copy-and-paste work",
                  "A downloadable call list ready for the sales team",
                  "More time potentially available for actual sales conversations",
                ].map((v) => (
                  <li key={v} className="flex gap-3 text-slate-200">
                    <Check aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    {v}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-slate-400">
                The evidence supports time and workflow improvements. It does not measure changes in call volume, sales or
                telephone costs.
              </p>
            </Reveal>
          </div>
          <div>
            <SectionHeading tone="dark" eyebrow="How it runs" title="Simple to operate" />
            <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2">
              {callList.architecture.map((a) => (
                <RevealItem key={a.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                  <h3 className="font-display font-bold">{a.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-300">{a.body}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* Limitations */}
      <Section tone="white" id="limitations">
        <SectionHeading
          eyebrow="Important limitations and responsible use"
          title="What the tool does not do — and what callers still must."
          intro="Automation speeds up research. It does not remove the need for human judgement or legal compliance."
        />
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {callList.limitations.map((l, i) => {
            const Icon = limitationIcons[i] ?? AlertTriangle;
            return (
              <RevealItem key={l.title} className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warn-soft text-warn">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-bold text-midnight-900">{l.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{l.body}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
        <Reveal className="mt-10 rounded-2xl bg-mist p-6 text-sm leading-relaxed text-slate-600">
          <strong className="text-midnight-900">About this case study.</strong> This is a demonstrated project from the
          founder’s work, documented in October 2026. The client is not named and no testimonial is implied. The tool is
          referred to internally as “{callList.toolName}”; it is unrelated to any third-party product of that name.
        </Reveal>
        <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact?interest=lead-research" variant="dark" size="lg">
            Ask About a Similar Workflow
          </ButtonLink>
          <ButtonLink href="/case-studies" variant="secondary" size="lg">
            Explore Our Case Studies
          </ButtonLink>
        </Reveal>
      </Section>

      <CtaBanner
        title="Need a similar workflow for your sales team?"
        body="Lead research, list building and CRM-ready exports can be designed around the sources you are entitled to use, in your market."
        primary={{ href: "/contact?interest=lead-research", label: "Discuss Your Project" }}
        secondary={{ href: "/services#lead-research", label: "Lead research service" }}
      />
    </>
  );
}
