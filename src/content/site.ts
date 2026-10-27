/**
 * Site-wide facts. Only verified details belong here.
 * Leave a field as `null` until the real value is confirmed — the UI hides
 * anything that is not set rather than showing a placeholder.
 */
export const site = {
  name: "Praxera Technologies",
  shortName: "Praxera",
  tagline: "Turning complex business processes into intelligent, practical solutions.",
  description:
    "Praxera Technologies helps businesses automate repetitive workflows, connect disconnected tools, and build practical AI-powered software that makes everyday operations simpler.",

  /** Production URL, e.g. https://praxera.tech — set NEXT_PUBLIC_SITE_URL once the domain is live. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || null,

  /** Public business email. Enquiries from the contact form are also delivered here. */
  publicEmail: "hello@praxera.in" as string | null,

  /** Direct WhatsApp contact. */
  whatsapp: {
    display: "+91 77092 88629",
    href: "https://wa.me/917709288629",
  },

  /** Legal entity details. Shown in the footer and policies only once supplied. */
  legal: {
    entityName: null as string | null,
    registrationNumber: null as string | null,
    registeredAddress: null as string | null,
  },

  /** First year the brand traded, used in the copyright line. */
  copyrightYear: 2026,

  founder: {
    name: "Tejas Patil",
    title: "Founder, Praxera Technologies",
    /** What the founder does for clients — written for business readers, not a tech stack. */
    capabilities: [
      "Finds where your team is losing time",
      "Recommends the simplest fix — existing tools or custom",
      "Designs, builds and delivers it end to end",
      "Stays your single point of contact through handover",
    ],
    location: "Nashik, Maharashtra, India",
    // Verified from https://tejas-patil-portfolio-chi.vercel.app
    portfolio: "https://tejas-patil-portfolio-chi.vercel.app/",
    github: "https://github.com/tejaspatil13",
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;
