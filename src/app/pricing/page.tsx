import type { Metadata } from "next";
import { Receipt, Repeat, Plug } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { PricingCards } from "@/components/pricing/PricingCards";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Engagement types and how pricing works: automation assessments, focused implementations, custom AI and software builds, and ongoing maintenance — quoted in your local currency.",
  alternates: canonical("/pricing"),
};

const costTypes = [
  {
    icon: Receipt,
    title: "One-time project fees",
    body: "Assessments and builds are quoted as a fixed fee for an agreed scope, so you know the cost before work begins.",
  },
  {
    icon: Repeat,
    title: "Recurring monthly fees",
    body: "Only for ongoing maintenance and improvement, and only if you choose it. Scope and response times are agreed in writing.",
  },
  {
    icon: Plug,
    title: "Third-party charges",
    body: "Hosting, software subscriptions, AI model usage and messaging fees (such as WhatsApp) are billed by those providers and itemised separately.",
  },
];

const faqs = [
  {
    q: "Why are prices not listed?",
    a: "Automation work varies widely with the tools, data and volume involved. Rather than publish numbers that may not fit your situation, we quote after understanding your process — always before any work begins.",
  },
  {
    q: "Which currency will my quote be in?",
    a: "Quotes are prepared in your local currency for India (INR), the United Kingdom (GBP), the United States (USD) and the Eurozone (EUR). Other countries are quoted in US dollars unless agreed otherwise.",
  },
  {
    q: "Are your prices simply currency conversions?",
    a: "No. Each market has its own price list. We do not convert one currency into another using live exchange rates.",
  },
  {
    q: "What happens after the assessment?",
    a: "You receive a written summary with prioritised opportunities and an indicative scope. You are free to take it forward with us, with another provider, or not at all.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Clear scope. Agreed price. No surprises."
        intro="Every engagement is scoped and priced in writing before work starts. Final pricing depends on your requirements and the agreed scope."
      />

      <Section tone="mist" id="engagements">
        <PricingCards />
      </Section>

      <Section tone="white" id="cost-types">
        <SectionHeading eyebrow="How costs are structured" title="Three kinds of cost, always shown separately." />
        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {costTypes.map((c) => (
            <RevealItem key={c.title} className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-midnight-900 text-accent">
                <c.icon aria-hidden className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display font-bold text-midnight-900">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="mist" id="faq">
        <SectionHeading eyebrow="Questions" title="Pricing questions" />
        <Reveal className="mt-10 divide-y divide-line rounded-2xl border border-line bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-bold text-midnight-900">
                {f.q}
                <span aria-hidden className="text-xl text-accent-strong transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </Section>

      <CtaBanner
        title="Get a tailored quote in your local currency."
        body="Start with a short description of what you want to improve."
        primary={{ href: "/contact?interest=assessment", label: "Request an Automation Assessment" }}
        secondary={{ href: "/contact", label: "Discuss Your Project" }}
      />
    </>
  );
}
