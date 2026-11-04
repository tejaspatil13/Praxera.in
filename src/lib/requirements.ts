import { z } from "zod";
import { budgets, needs, type BudgetCurrency } from "@/content/requirements";
import { MIN_FILL_MS } from "@/lib/enquiry";
import { site } from "@/content/site";

export { MIN_FILL_MS };

export const requirementSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name.").max(100, "Please shorten your name."),
    whatsapp: z
      .string()
      .trim()
      .regex(/^\+?[0-9 ()-]{7,20}$/, "Please enter a valid number, e.g. +91 98765 43210."),
    email: z.union([z.literal(""), z.string().trim().max(200).email("Please enter a valid email address.")]).default(""),
    business: z.string().trim().max(150, "Please shorten the name.").default(""),
    link: z.string().trim().max(300, "Please shorten this link.").default(""),
    about: z.string().trim().min(5, "Please tell us a little about your business.").max(2000, "Please keep this under 2,000 characters."),
    problem: z.string().trim().min(5, "Please tell us the problem you want to solve.").max(3000, "Please keep this under 3,000 characters."),
    today: z.string().trim().max(3000, "Please keep this under 3,000 characters.").default(""),
    needs: z.array(z.enum(needs)).min(1, "Please choose at least one option."),
    currency: z.enum(Object.keys(budgets) as [BudgetCurrency, ...BudgetCurrency[]]),
    budget: z.string({ error: "Please choose a budget range." }).min(1, "Please choose a budget range."),
    // Spam controls
    website: z.string().max(0).default(""),
    startedAt: z.number().int().positive(),
  })
  .refine((v) => (budgets[v.currency] as readonly string[]).includes(v.budget), {
    path: ["budget"],
    message: "Please choose a budget range.",
    when: (payload) => {
      const v = payload.value as { currency?: unknown };
      return typeof v.currency === "string" && v.currency in budgets;
    },
  });

export type RequirementInput = z.input<typeof requirementSchema>;
export type Requirement = z.output<typeof requirementSchema>;

/** What is stored for each requirement; the spam-control fields are dropped. */
export type RequirementAnswers = Omit<Requirement, "website" | "startedAt">;

export function toAnswers(r: Requirement): RequirementAnswers {
  const { name, whatsapp, email, business, link, about, problem, today, needs, currency, budget } = r;
  return { name, whatsapp, email, business, link, about, problem, today, needs, currency, budget };
}

export const statuses = {
  new: "New",
  contacted: "Contacted",
  proposal: "Proposal sent",
  won: "Won",
  lost: "Lost",
} as const;

export type RequirementStatus = keyof typeof statuses;

export function isStatus(v: unknown): v is RequirementStatus {
  return typeof v === "string" && v in statuses;
}

/** Labelled answers, shared by the admin page, the notification email and the WhatsApp hand-off. */
export function requirementRows(a: RequirementAnswers): [string, string][] {
  return [
    ["Name", a.name],
    ["WhatsApp", a.whatsapp],
    ["Email", a.email || "—"],
    ["Business", a.business || "—"],
    ["Website or social link", a.link || "—"],
    ["What the business does", a.about],
    ["Problem to solve", a.problem],
    ["How it is handled today", a.today || "—"],
    ["Looking for", a.needs.join(", ")],
    ["Budget", `${a.budget} (${a.currency})`],
  ];
}

export function requirementText(a: RequirementAnswers): string {
  const lines = requirementRows(a)
    .filter(([, v]) => v !== "—")
    .map(([k, v]) => `${k}: ${v}`);
  return `Hello ${site.shortName}, here are my requirements.\n\n${lines.join("\n")}`;
}

/** A ready-to-paste prompt for drafting the proposal with an AI assistant. */
export function proposalBrief(a: RequirementAnswers, notes: string): string {
  const facts = requirementRows(a)
    .filter(([, v]) => v !== "—")
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");
  return `Write a short, plain-English client proposal from ${site.name} (${site.tagline}).

The reader is a busy business owner, not a technical person. Use only the facts below. Do not invent results, client names or statistics. Where a detail is missing, list it under "Questions for you" instead of guessing.

Sections:
1. What we understood about your business and problem
2. What we recommend, and why it is the simplest fix
3. What you will get (clear deliverables)
4. Timeline in phases
5. Price, with 2 options that fit the budget below
6. Questions for you
7. Next step

Client requirements:
${facts}
${notes.trim() ? `\nMy notes from talking to them:\n${notes.trim()}\n` : ""}`;
}

/** wa.me link for a saved number. Numbers typed without a country code are assumed to be Indian. */
export function whatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
}
