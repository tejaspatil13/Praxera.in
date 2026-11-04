/**
 * Choices shown on the /requirements form.
 * Saved requirements keep the exact text chosen here, so editing these never changes old entries.
 */

export const needs = [
  "Automate repetitive work",
  "WhatsApp automation",
  "AI chatbot or assistant",
  "Website",
  "Mobile app",
  "Custom software or dashboard",
  "Not sure, please suggest",
] as const;

export const NOT_SURE = "Not sure yet";

export const budgets = {
  INR: ["₹25,000 – ₹50,000", "₹50,000 – ₹1 lakh", "₹1 lakh – ₹3 lakh", "₹3 lakh – ₹10 lakh", "Above ₹10 lakh", NOT_SURE],
  USD: ["Under $500", "$500 – $1,500", "$1,500 – $5,000", "$5,000 – $15,000", "$15,000 – $50,000", "Above $50,000", NOT_SURE],
  GBP: ["Under £500", "£500 – £1,000", "£1,000 – £4,000", "£4,000 – £12,000", "£12,000 – £40,000", "Above £40,000", NOT_SURE],
  EUR: ["Under €500", "€500 – €1,500", "€1,500 – €5,000", "€5,000 – €15,000", "€15,000 – €50,000", "Above €50,000", NOT_SURE],
} as const;

export type BudgetCurrency = keyof typeof budgets;

export const currencies: { code: BudgetCurrency; label: string }[] = [
  { code: "INR", label: "₹ INR" },
  { code: "USD", label: "$ USD" },
  { code: "GBP", label: "£ GBP" },
  { code: "EUR", label: "€ EUR" },
];

/** Languages offered for voice typing. Codes are BCP 47 tags understood by the browser. */
export const voiceLanguages = [
  { code: "en-IN", label: "English" },
  { code: "hi-IN", label: "हिंदी" },
  { code: "mr-IN", label: "मराठी" },
] as const;
