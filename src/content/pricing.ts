/**
 * Regional pricing.
 *
 * HOW TO PUBLISH PRICES
 * Each region has its own approved price list. Prices are NOT converted
 * between currencies — enter the amount you have approved for that market.
 * Any engagement left as `null` shows “Request a tailored quote” instead.
 *
 *   assessment: { amount: 25000, basis: "from" },   // “From ₹25,000”
 *   maintenance: { amount: 400, basis: "fixed" },   // “£400 / month”
 */

export type RegionId = "IN" | "GB" | "US" | "EU" | "INTL";

export type Region = {
  id: RegionId;
  label: string;
  currency: "INR" | "GBP" | "USD" | "EUR";
  symbol: string;
  locale: string;
};

export const regions: Record<RegionId, Region> = {
  IN: { id: "IN", label: "India", currency: "INR", symbol: "₹", locale: "en-IN" },
  GB: { id: "GB", label: "United Kingdom", currency: "GBP", symbol: "£", locale: "en-GB" },
  US: { id: "US", label: "United States", currency: "USD", symbol: "$", locale: "en-US" },
  EU: { id: "EU", label: "Eurozone", currency: "EUR", symbol: "€", locale: "en-IE" },
  INTL: { id: "INTL", label: "International", currency: "USD", symbol: "$", locale: "en-US" },
};

export const regionOrder: RegionId[] = ["IN", "GB", "US", "EU", "INTL"];

/** ISO 3166-1 alpha-2 codes of euro-using countries. */
const EUROZONE = new Set([
  "AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
  "AD", "MC", "SM", "VA", "ME", "XK", "BG",
]);

export function regionForCountry(country: string | null | undefined): RegionId {
  const c = country?.toUpperCase();
  if (!c) return "INTL";
  if (c === "IN") return "IN";
  if (c === "GB" || c === "UK" || c === "GG" || c === "JE" || c === "IM") return "GB";
  if (c === "US") return "US";
  if (EUROZONE.has(c)) return "EU";
  return "INTL";
}

export type EngagementId = "assessment" | "implementation" | "custom" | "maintenance";

export type Price = { amount: number; basis: "from" | "fixed" };

export const priceLists: Record<RegionId, Record<EngagementId, Price | null>> = {
  IN: { assessment: null, implementation: null, custom: null, maintenance: null },
  GB: { assessment: null, implementation: null, custom: null, maintenance: null },
  US: { assessment: null, implementation: null, custom: null, maintenance: null },
  EU: { assessment: null, implementation: null, custom: null, maintenance: null },
  INTL: { assessment: null, implementation: null, custom: null, maintenance: null },
};

export type Engagement = {
  id: EngagementId;
  name: string;
  billing: "one-time" | "monthly";
  summary: string;
  suitableFor: string;
  includes: string[];
  cta: { label: string; interest: string };
  highlight?: boolean;
};

export const engagements: Engagement[] = [
  {
    id: "assessment",
    name: "Workflow or Automation Assessment",
    billing: "one-time",
    summary: "A focused review of one or more workflows to find what is worth automating, and how.",
    suitableFor: "Businesses that know something is slow or manual but want a clear plan before committing to a build.",
    includes: [
      "Walkthrough of the current process with the people who run it",
      "Map of manual steps, tools and data involved",
      "Automation opportunities prioritised by value and effort",
      "Recommended approach: existing tools or custom build",
      "Written summary with next steps and an indicative scope",
    ],
    cta: { label: "Request an assessment", interest: "assessment" },
    highlight: true,
  },
  {
    id: "implementation",
    name: "Focused Automation Implementation",
    billing: "one-time",
    summary: "Build and deploy one well-defined automation, integration or reporting workflow.",
    suitableFor: "Teams with a specific, repetitive process — such as data entry, report building or lead-list preparation.",
    includes: [
      "Agreed scope, deliverables and acceptance criteria",
      "Build with validation and error handling",
      "Testing against real, authorised sample inputs",
      "Deployment to your environment or an agreed host",
      "Handover documentation and walkthrough",
    ],
    cta: { label: "Discuss an automation", interest: "automation" },
  },
  {
    id: "custom",
    name: "Custom AI Application or Software Development",
    billing: "one-time",
    summary: "A custom application, AI assistant, agent workflow or internal tool built around how your business works.",
    suitableFor: "Businesses that need capabilities no off-the-shelf product provides, or an MVP for a new product.",
    includes: [
      "Solution design and technical architecture",
      "Phased delivery with review points",
      "AI components with appropriate human oversight",
      "Security, access and data-handling considerations",
      "Deployment, documentation and handover",
    ],
    cta: { label: "Discuss a custom build", interest: "custom-software" },
  },
  {
    id: "maintenance",
    name: "Ongoing Maintenance and Improvement",
    billing: "monthly",
    summary: "Keep delivered systems running well and improve them as your business changes.",
    suitableFor: "Clients with a delivered system who want monitoring, fixes and steady improvements.",
    includes: [
      "Fixes and updates for delivered systems",
      "Adjustments when connected tools or APIs change",
      "Agreed improvement time each month",
      "Priority response on reported issues, as agreed",
    ],
    cta: { label: "Ask about support", interest: "maintenance" },
  },
];

export function formatPrice(price: Price, region: Region): string {
  const amount = new Intl.NumberFormat(region.locale, {
    style: "currency",
    currency: region.currency,
    maximumFractionDigits: 0,
  }).format(price.amount);
  return price.basis === "from" ? `From ${amount}` : amount;
}
