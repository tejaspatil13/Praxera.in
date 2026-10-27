import type { Metadata } from "next";
import { Check, Hand, Info, MessageCircle, ShieldCheck, SearchCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { LeadFlow } from "@/components/visuals/LeadFlow";
import { leadKaro } from "@/content/caseStudies";
import { site } from "@/content/site";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Case Study: LeadKaro — Lead Generation and WhatsApp Outreach",
  description:
    "LeadKaro finds high-match buyers by place and product, exports them to Excel, and sends each lead an AI-written WhatsApp message with a product image.",
  alternates: canonical(`/case-studies/${leadKaro.slug}`),
};

const responsibleIcons = [ShieldCheck, MessageCircle, SearchCheck];

export default function LeadKaroPage() {
  return (
    <>
      <PageHero eyebrow={`Case study · ${leadKaro.label}`} title={leadKaro.title} intro={leadKaro.summary}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={leadKaro.liveUrl} external size="lg">
            View live demo
          </ButtonLink>
          <ButtonLink href={leadKaro.githubUrl} external variant="ghost" size="lg">
            Source code on GitHub
          </ButtonLink>
        </div>
      </PageHero>

      <Section tone="white" id="problem">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="The problem"
              title="Finding buyers and reaching out takes hours of repetitive work."
              intro="To sell a product locally, a business has to find likely buyers in an area, collect their contact details, then write and send each message — usually one at a time."
            />
          </div>
          <Reveal delay={0.1} className="lg:col-span-6">
            <div className="rounded-2xl border border-warn/20 bg-warn-soft/50 p-6 sm:p-8">
              <p className="eyebrow flex items-center gap-2 text-warn">
                <Hand aria-hidden className="h-4 w-4" /> Done by hand
              </p>
              <ol className="mt-5 space-y-3">
                {leadKaro.manualSteps.map((s, i) => (
                  <li key={s} className="flex gap-3 text-slate-700">
                    <span className="font-mono text-sm text-warn">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark" id="how-it-works">
        <SectionHeading
          tone="dark"
          eyebrow="How it works"
          title="Four steps, one flow."
          intro="LeadKaro brings research, list-building and outreach into one tool."
        />
        <div className="mt-14">
          <LeadFlow tone="dark" />
        </div>
      </Section>

      <Section tone="white" id="stack">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Technology" title="Built with" />
            <Reveal delay={0.1}>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies used">
                {leadKaro.stack.map((t) => (
                  <li key={t} className="rounded-lg border border-line bg-mist px-3 py-1.5 font-mono text-sm text-slate-700">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-slate-500">
                Next.js and TypeScript for the application; Evolution API to send WhatsApp messages.
              </p>
            </Reveal>
          </div>
          <div>
            <SectionHeading eyebrow="What a business gets" title="Useful outcomes" />
            <RevealGroup className="mt-8 space-y-3">
              {[
                "A lead list built from a place and a product, not hours of searching",
                "An Excel export the sales team can work from",
                "Personalised first messages without writing each one by hand",
                "Product images sent with every message",
              ].map((t) => (
                <RevealItem key={t} className="flex items-start gap-3 rounded-xl border border-line bg-white p-4 text-slate-700 shadow-card">
                  <Check aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" />
                  {t}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      <Section tone="mist" id="responsible-use">
        <SectionHeading
          eyebrow="Responsible use"
          title="Outreach automation must respect the people receiving it."
        />
        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {leadKaro.responsibleUse.map((r, i) => {
            const Icon = responsibleIcons[i];
            return (
              <RevealItem key={r.title} className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warn-soft text-warn">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-bold text-midnight-900">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.body}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
        <Reveal className="mt-10 flex gap-3 rounded-2xl bg-white p-6 text-sm leading-relaxed text-slate-600">
          <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
          <p>
            Project details are taken from{" "}
            <a href={`${site.founder.portfolio}#projects`} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-strong underline-offset-2 hover:underline">
              {site.founder.name}’s portfolio
            </a>
            . No client, measured result or commercial outcome is claimed.
          </p>
        </Reveal>
      </Section>

      <CtaBanner
        title="Want lead generation and WhatsApp follow-up for your business?"
        body="Tell us what you sell, where your buyers are, and how you reach them today."
        primary={{ href: "/contact?interest=whatsapp", label: "Discuss Your Project" }}
        secondary={{ href: "/services#whatsapp-automation", label: "WhatsApp automation service" }}
      />
    </>
  );
}
