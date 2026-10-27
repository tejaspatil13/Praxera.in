export const processSteps = [
  {
    title: "Discover",
    body: "Understand the business, the current process, the pain points and the result you want.",
  },
  {
    title: "Assess",
    body: "Decide what should be improved, what can be automated, and whether an existing tool or a custom solution is the right fit.",
  },
  {
    title: "Scope",
    body: "Agree deliverables, integrations, dependencies, security considerations, timeline and price — before any build begins.",
  },
  {
    title: "Build",
    body: "Implement the solution with maintainable code, proper validation and the controls your team needs.",
  },
  {
    title: "Test and Deploy",
    body: "Test against real, authorised sample inputs. Check expected behaviour, error handling and deployment requirements.",
  },
  {
    title: "Handover and Support",
    body: "Documentation, a walkthrough of how it works, and an agreed plan for any maintenance or support.",
  },
] as const;

export const principles = [
  {
    title: "Start with the business problem",
    body: "Technology is chosen after the problem is understood, never before.",
  },
  {
    title: "Understand the workflow first",
    body: "We map how work actually happens today — including the workarounds — before proposing change.",
  },
  {
    title: "Use existing tools where they are enough",
    body: "If a tool you already own can do the job, we will say so. Custom builds are for when they add genuine value.",
  },
  {
    title: "Validate with real inputs",
    body: "Workflows are tested against real, authorised examples rather than idealised demo data.",
  },
  {
    title: "Keep it understandable",
    body: "Solutions should be maintainable and make sense to the people who use them every day.",
  },
] as const;

export const fit = {
  good: [
    "A clear, repetitive process is costing your team hours every week",
    "Information is spread across tools that do not talk to each other",
    "You want AI applied to a specific workflow, not a general chatbot",
    "You would rather start with a focused assessment than a large commitment",
  ],
  notFit: [
    "You need guaranteed results before the process has been understood",
    "The goal is to collect or contact people without a lawful basis",
    "You are looking for a large agency with a big in-house team",
  ],
} as const;
