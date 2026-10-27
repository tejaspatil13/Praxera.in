/** Options for the enquiry form’s “area of interest”. Keys are used in ?interest= links. */
export const interests = {
  assessment: "Workflow or automation assessment",
  automation: "Workflow or process automation",
  "ai-application": "AI application or AI agent",
  whatsapp: "WhatsApp or customer communication",
  "data-automation": "Spreadsheet, Excel or data automation",
  integration: "Connecting business systems",
  "custom-software": "Custom software or web application",
  "lead-research": "Lead research and call-list automation",
  reporting: "Reporting and dashboards",
  maintenance: "Maintenance of an existing system",
  other: "Something else",
} as const;

export type InterestId = keyof typeof interests;

export function isInterest(value: string | null | undefined): value is InterestId {
  return !!value && value in interests;
}
