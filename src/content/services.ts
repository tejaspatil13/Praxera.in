import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  Workflow,
  MessageCircle,
  Sheet,
  Cable,
  AppWindow,
  Target,
  BarChart3,
  Compass,
} from "lucide-react";

export type Service = {
  id: string;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  summary: string;
  outcome: string;
  items: string[];
  /** Honest caveats shown with the service. */
  note?: string;
  /** Related proof from real work, if any. */
  proof?: { label: string; href: string };
};

export const services: Service[] = [
  {
    id: "workflow-automation",
    shortTitle: "Workflow automation",
    title: "Workflow and Business Process Automation",
    icon: Workflow,
    summary:
      "Take the repetitive steps out of everyday operations — the copying, checking, chasing and re-typing that eat into your team’s day.",
    outcome: "Fewer manual steps, fewer missed follow-ups.",
    items: [
      "Repetitive administrative workflows",
      "Automated data entry, routing, notifications and follow-ups",
      "Lead research and prospect-list preparation",
      "Automated reporting and operational workflows",
      "Approval processes and scheduled tasks",
    ],
    proof: { label: "Call-list automation case study", href: "/case-studies/uk-call-list-automation" },
  },
  {
    id: "ai-applications",
    shortTitle: "AI applications and agents",
    title: "AI Applications and AI Agents",
    icon: BrainCircuit,
    summary:
      "AI that works on your own documents and processes — answering, extracting, classifying and summarising, with people kept in control of decisions.",
    outcome: "Useful AI grounded in your data, not generic chat.",
    items: [
      "AI assistants for business workflows",
      "Retrieval-augmented generation (RAG) knowledge assistants",
      "Document understanding and information extraction",
      "AI classification, summarisation and decision-support workflows",
      "Multi-step AI agents with appropriate human approval and oversight",
    ],
  },
  {
    id: "whatsapp-automation",
    shortTitle: "WhatsApp automation",
    title: "WhatsApp and Customer Communication Automation",
    icon: MessageCircle,
    summary:
      "Respond to enquiries consistently, send reminders on time and route each conversation to the right person — on the channels your customers already use.",
    outcome: "Every enquiry captured and followed up.",
    items: [
      "WhatsApp Business Platform integrations",
      "Enquiry handling and lead capture",
      "Appointment reminders and follow-ups",
      "Customer support workflows",
      "Routing enquiries to the appropriate person or team",
    ],
    proof: { label: "LeadKaro case study", href: "/case-studies/leadkaro-lead-generation" },
    note: "Production WhatsApp messaging requires an approved WhatsApp Business account, supported API access and customer consent. Meta’s messaging charges apply and are billed separately from our work.",
  },
  {
    id: "spreadsheet-automation",
    shortTitle: "Sheets and Excel automation",
    title: "Google Sheets, Excel and Data Automation",
    icon: Sheet,
    summary:
      "Spreadsheets that build, clean and update themselves — so reports arrive ready and the numbers can be trusted.",
    outcome: "Reports that are ready when you need them.",
    items: [
      "Spreadsheet generation and updates",
      "Automated reporting",
      "Data cleaning, validation and transformation",
      "Importing and exporting data between systems",
      "Scheduled reports and alerts",
      "Connecting spreadsheets with APIs and business applications",
    ],
  },
  {
    id: "integrations",
    shortTitle: "System integrations",
    title: "Business System Integrations",
    icon: Cable,
    summary:
      "Connect the tools you already pay for so information moves between them on its own, instead of by copy-and-paste.",
    outcome: "One source of truth instead of five.",
    items: [
      "Connecting CRMs, forms, email, spreadsheets, databases and internal applications",
      "REST API integrations and webhook-based workflows",
      "Synchronising records between supported systems",
      "Removing unnecessary copy-and-paste operations",
    ],
    note: "What can be connected depends on each system’s available API and your account’s access level. We confirm this during assessment, before any build begins.",
  },
  {
    id: "custom-software",
    shortTitle: "Custom software",
    title: "Custom Software and Web Applications",
    icon: AppWindow,
    summary:
      "When no off-the-shelf product fits the way you work, we build the tool your team actually needs.",
    outcome: "Software shaped around your process.",
    items: [
      "Internal business tools",
      "Customer and employee portals",
      "Admin dashboards",
      "SaaS MVPs",
      "Custom workflow applications",
      "Backend APIs and database-driven applications",
    ],
  },
  {
    id: "lead-research",
    shortTitle: "Lead research automation",
    title: "AI-Powered Lead Research and Sales Operations",
    icon: Target,
    summary:
      "Turn hours of manual prospect research into structured, CRM-ready lists built from public business information.",
    outcome: "More time selling, less time searching.",
    items: [
      "Public business information discovery",
      "Structured prospect-list generation",
      "Contact-data organisation",
      "CRM-ready exports",
      "Sales research workflows",
    ],
    note: "We work only with sources you are entitled to use. Public data can be incomplete or out of date, so matches should be verified, and outbound calling and messaging must follow local rules such as TPS/CTPS screening in the UK. We do not offer access to private databases or guarantee contact accuracy.",
    proof: { label: "Call-list automation case study", href: "/case-studies/uk-call-list-automation" },
  },
  {
    id: "reporting",
    shortTitle: "Reporting and dashboards",
    title: "Reporting, Dashboards and Business Intelligence",
    icon: BarChart3,
    summary:
      "Bring scattered figures together and see what is actually happening in the business, without assembling it by hand each week.",
    outcome: "Visibility without the weekly scramble.",
    items: [
      "Operational dashboards",
      "Automated Excel reports",
      "Data consolidation",
      "KPI reporting using real connected data",
      "Scheduled business summaries",
    ],
  },
  {
    id: "consulting",
    shortTitle: "AI and automation consulting",
    title: "AI and Automation Consulting",
    icon: Compass,
    summary:
      "Not sure where to start? We map your workflows and tell you plainly what is worth automating — and what is not.",
    outcome: "A clear, prioritised plan before you spend on a build.",
    items: [
      "Workflow discovery",
      "Automation feasibility assessment",
      "Prioritisation by business value and implementation effort",
      "Technical solution design",
      "Proof of concept and implementation roadmap",
    ],
  },
];
