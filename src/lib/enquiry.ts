import { z } from "zod";
import { interests } from "@/content/interests";
import { countryName } from "@/content/countries";

export const contactMethods = {
  email: "Email",
  phone: "Phone call",
  whatsapp: "WhatsApp",
} as const;

export const MIN_FILL_MS = 2500;

export const enquirySchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name.").max(100, "Please shorten your name."),
    email: z.string().trim().max(200).email("Please enter a valid email address."),
    company: z.string().trim().max(150, "Please shorten the company name.").optional().default(""),
    country: z.string().trim().length(2, "Please choose your country."),
    interest: z.enum(Object.keys(interests) as [keyof typeof interests, ...(keyof typeof interests)[]]).optional(),
    message: z
      .string()
      .trim()
      .min(1, "Please tell us what you would like to improve.")
      .max(3000, "Please keep this under 3,000 characters."),
    contactMethod: z.enum(["email", "phone", "whatsapp"]).default("email"),
    phone: z.string().trim().max(30).optional().default(""),
    consent: z.literal(true, { error: "Please confirm you agree to be contacted about this enquiry." }),
    currency: z.string().trim().max(3).optional().default(""),
    // Spam controls
    website: z.string().max(0).optional().default(""),
    startedAt: z.number().int().positive(),
  })
  .refine((v) => v.contactMethod === "email" || /^\+?[0-9 ()-]{7,20}$/.test(v.phone ?? ""), {
    path: ["phone"],
    message: "Please enter a phone number including the country code, e.g. +44 20 7946 0000.",
    // Run even when other fields are invalid, so every error is shown at once.
    when: (payload) => {
      const v = payload.value as { contactMethod?: unknown };
      return v.contactMethod === "phone" || v.contactMethod === "whatsapp";
    },
  });

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Labelled fields for the enquiry email, shared by every delivery route. */
export function enquiryRows(e: Enquiry): [string, string][] {
  return [
    ["Name", e.name],
    ["Email", e.email],
    ["Company", e.company || "—"],
    ["Country", `${countryName(e.country)} (${e.country})`],
    ["Area of interest", e.interest ? interests[e.interest] : "—"],
    ["Preferred contact", contactMethods[e.contactMethod]],
    ...(e.contactMethod !== "email" ? ([["Phone / WhatsApp", e.phone]] as [string, string][]) : []),
    ["Quote currency", e.currency || "—"],
  ];
}

export function enquirySubject(e: Enquiry): string {
  return `Enquiry from ${e.name}${e.company ? ` (${e.company})` : ""}`;
}
