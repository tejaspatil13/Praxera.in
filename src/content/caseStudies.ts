/**
 * Case-study facts.
 * - callList: every figure comes from the demonstration document
 *   "Copilot – How it saves your team time" (Oct 2026).
 * - leadKaro: taken from the founder's portfolio
 *   (https://tejas-patil-portfolio-chi.vercel.app/#projects).
 */

export const callList = {
  slug: "uk-call-list-automation",
  href: "/case-studies/uk-call-list-automation",
  label: "Sales operations · Lead research automation",
  title: "Turning hours of manual prospect research into a fast, structured call list.",
  shortTitle: "UK Business Contact Discovery and Call-List Automation",
  toolName: "Copilot",
  summary:
    "A browser-based tool that searches the UK government business-rates list, matches each listed property against public business listings, and produces a ready-to-call Excel sheet — replacing four copy-and-paste steps per contact.",

  demo: {
    context: "Coventry · CV1 · rateable value £12,000+",
    propertiesChecked: 1178,
    phoneNumbersFound: 1012,
    secondsToResults: 2.8,
  },
  manualBaseline: "2–3 hours for one person to build a list of 50–60 contacts",

  manualSteps: [
    { title: "Search the government site", body: "Enter town, postcode and rateable value on the business-rates website." },
    { title: "Copy each address", body: "Open every property and copy its address, one by one." },
    { title: "Look it up on Google Maps", body: "Find which business is there and its phone number." },
    { title: "Paste into the sheet", body: "Type the name, address and number into Google Sheets." },
  ],
  automatedSteps: [
    { title: "Enter search criteria", body: "Town, postcode, description code and rateable value — the same choices as the government site." },
    { title: "Match public information", body: "Listed properties are matched to public business listings by postcode, building number and street." },
    { title: "Generate the call list", body: "A structured Excel sheet with only the properties that have a phone number." },
  ],

  illustrative: {
    callers: 15,
    hoursPerCaller: 3,
    perDay: 45,
    perWeek: 225,
    fullTimeEquivalent: 6,
    hoursPerFte: 37.5,
  },

  comparison: [
    { row: "Building a 50–60 contact list", manual: "2–3 hours", automated: "About a minute" },
    { row: "Steps per contact", manual: "4 copy-and-paste steps", automated: "None — one search" },
    { row: "Removed properties", manual: "Checked by hand", automated: "Skipped automatically" },
    { row: "How many per search", manual: "One property at a time", automated: "Every listed property in the area" },
    { row: "Typing mistakes", manual: "Easy to make", automated: "Copied straight from the source" },
    { row: "Getting the Excel sheet", manual: "Built by hand", automated: "One click, named your way" },
  ],

  sources: {
    ratingList:
      "The official rating list of business properties in England and Wales — 2.1 million properties with addresses and rateable values. It supplies the property, address and rateable value; it does not supply phone numbers.",
    listings:
      "Around 4 million UK business listings with names and phone numbers, published openly by the Overture Maps Foundation (whose members include Amazon, Meta, Microsoft and TomTom).",
  },

  features: [
    { title: "Searches like the government site", body: "Town, postcode, description code and rateable-value range. Choosing a town fills the postcode list, with the number of properties in each." },
    { title: "Skips removed properties", body: "Only properties still listed with a current valuation are kept." },
    { title: "Phone numbers in +44 format", body: "Numbers are written with the UK country code, ready to dial." },
    { title: "Links to check every result", body: "Each row links to its Gov.uk record and to Google Maps so callers can verify." },
    { title: "Other numbers at the same address", body: "Shared buildings list the other businesses there, giving callers a next number to try." },
    { title: "My sheet", body: "Combine many searches into one call list. Duplicates are skipped; filter by description, search or text." },
    { title: "Per-employee history", body: "Each employee has their own sheet and search history; their name becomes the default file name." },
    { title: "One-click Excel", body: "Download everything or just the filtered rows, with your own file name, in the team’s usual columns." },
  ],

  architecture: [
    { title: "Runs on one office computer", body: "The whole team opens it in their browser." },
    { title: "Updates itself", body: "Checks for new data every day and installs it overnight." },
    { title: "Nothing to get blocked", body: "No Google scraping and no paid APIs." },
    { title: "Free to run", body: "No per-search or subscription costs to operate." },
  ],

  excelColumns: ["Business name", "Address", "Rateable value", "Contact number", "Comments", "Status", "Other numbers at this address", "Note"],

  limitations: [
    { title: "Listings can be out of date", body: "Public business listings may contain outdated or missing contact details. The listing data is refreshed monthly, so a very new business or a recently changed number may be missing." },
    { title: "Shared buildings", body: "One address can hold several businesses. The most likely number is given with the others listed — callers confirm who answers." },
    { title: "Matches need human checks", body: "Matching is by postcode, building number and street. Each row links to Gov.uk and Google Maps so a person can verify before relying on it." },
    { title: "TPS and CTPS screening", body: "Before sales calls, numbers must still be screened against the TPS and CTPS registers. The tool does not perform this step." },
    { title: "Coverage varies", body: "Busy commercial areas return the most numbers (1,012 of 1,178 in Coventry CV1). Industrial estates usually return fewer." },
    { title: "Public is not the same as unrestricted", body: "Information being publicly available does not grant permission for every use. Outreach must respect data-protection and direct-marketing rules." },
  ],

  screenshots: {
    search: { src: "/case-studies/call-list/search-results.png", width: 1440, height: 635, alt: "Copilot search screen: London, EC1V 9LT, offices, rateable value £5,000–£50,000, showing 15 listed properties, all 15 with a phone number, each with Gov.uk and Google Maps links." },
    postcodes: { src: "/case-studies/call-list/postcode-picker.png", width: 672, height: 608, alt: "Postcode picker after choosing Coventry, listing CV1 to CV8 with the number of properties in each." },
    sheet: { src: "/case-studies/call-list/my-sheet.png", width: 1440, height: 740, alt: "My sheet view with 21 properties from 3 searches, filters for text, description and source search, and a Download all button." },
    fileName: { src: "/case-studies/call-list/file-name-dialog.png", width: 720, height: 432, alt: "Dialog asking for the Excel file name, pre-filled with the employee’s name and the date." },
    excel: { src: "/case-studies/call-list/excel-output.png", width: 1728, height: 836, alt: "Downloaded Excel file with columns for business name, address, rateable value, contact number, comments, status, other numbers at the address, and a note." },
  },
} as const;

export const leadKaro = {
  slug: "leadkaro-lead-generation",
  href: "/case-studies/leadkaro-lead-generation",
  label: "Lead generation · WhatsApp outreach",
  name: "LeadKaro",
  tag: "AI Lead Generation Platform",
  title: "From a place and a product to a lead list and a personalised WhatsApp message.",
  summary:
    "Search leads by place and product to pull contact details of high-match buyers, export them to Excel, and send an AI-written WhatsApp message with your product image straight to each lead.",
  stack: ["Next.js", "TypeScript", "Evolution API"],
  liveUrl: "https://lead-karo.vercel.app/demo",
  githubUrl: "https://github.com/tejaspatil13/LeadKaro",
  steps: [
    { title: "Search by place and product", body: "Choose where you sell and what you sell." },
    { title: "Find high-match buyers", body: "Contact details of matching businesses are pulled in one step." },
    { title: "Export to Excel", body: "The lead list downloads as a spreadsheet for your team." },
    { title: "AI-written WhatsApp message", body: "Each lead receives a written message with your product image." },
  ],
  manualSteps: [
    "Search for buyers one by one",
    "Copy names and numbers into a sheet",
    "Write a message for each lead",
    "Send messages and images by hand",
  ],
  responsibleUse: [
    {
      title: "Consent and messaging rules",
      body: "Businesses should only message people who can lawfully be contacted, and must respect opt-outs and local direct-marketing rules.",
    },
    {
      title: "Official WhatsApp access for production",
      body: "The project uses Evolution API. For production client deployments we recommend the official WhatsApp Business Platform, which requires an approved account and applies Meta’s messaging charges.",
    },
    {
      title: "Contact data needs checking",
      body: "Public business details can be incomplete or out of date, so lead lists should be reviewed before outreach.",
    },
  ],
} as const;
