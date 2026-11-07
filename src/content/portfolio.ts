/**
 * Everything written on /portfolio that is not managed from the admin.
 * Background details come from Tejas's own portfolio site. Add only verified facts here.
 */

export const profile = {
  name: "Tejas Patil",
  roles: ["Video Editor", "Creative Content Producer", "Motion Graphics Designer", "AI-Powered Content Creator"],
  email: "hello@praxera.in",
  linkedin: "https://linkedin.com/in/tejas-patil-874829250",
  github: "https://github.com/tejaspatil13",
  instagram: "https://www.instagram.com/praxeratechnologies/",
  location: "Nashik, Maharashtra, India",
};

export const videoCategories = [
  "Instagram Reels",
  "Brand Promotions",
  "Cinematic Edits",
  "Motion Graphics",
  "AI-Generated Videos",
  "YouTube Videos",
  "Advertisements",
] as const;

export type VideoCategory = (typeof videoCategories)[number];

export type PortfolioVideo = {
  id: string;
  title: string;
  description: string;
  category: VideoCategory;
  thumbnailUrl: string;
  sourceType: string;
  videoUrl: string;
  featured: boolean;
  displayOrder: number;
  published: boolean;
};

/** Hosted with the site so they play here. Shown until the database is connected, and added to it the first time it is created. */
export const starterVideos: Omit<PortfolioVideo, "id">[] = [
  {
    title: "Reel Cut",
    description: "A fast cut across recent reels: type-led motion, interface animation and voiceover.",
    category: "Motion Graphics",
    thumbnailUrl: "/portfolio/poster-showreel.jpg",
    sourceType: "file",
    videoUrl: "/portfolio/showreel.mp4",
    featured: false,
    displayOrder: 1,
    published: true,
  },
  {
    title: "Weeks of Research. One Click.",
    description: "A B2B project told as a reel, turning a research-heavy story into a clear, fast narrative.",
    category: "Instagram Reels",
    thumbnailUrl: "/portfolio/poster-research.jpg",
    sourceType: "file",
    videoUrl: "/portfolio/reel-research.mp4",
    featured: false,
    displayOrder: 2,
    published: true,
  },
  {
    title: "Your Line Was Busy",
    description: "One patient's journey through a dental clinic, with animated WhatsApp and booking interfaces.",
    category: "Advertisements",
    thumbnailUrl: "/portfolio/poster-dental.jpg",
    sourceType: "file",
    videoUrl: "/portfolio/reel-dental.mp4",
    featured: false,
    displayOrder: 3,
    published: true,
  },
  {
    title: "Before the First Call",
    description: "A Hinglish promotional reel on the hours lost to manual data collection, built around screen footage.",
    category: "Brand Promotions",
    thumbnailUrl: "/portfolio/poster-calls.jpg",
    sourceType: "file",
    videoUrl: "/portfolio/reel-calls.mp4",
    featured: false,
    displayOrder: 4,
    published: true,
  },
];

export const services = [
  { title: "Instagram Reels Editing", text: "Short-form edits with captions, transitions and pacing built to hold attention." },
  { title: "Motion Graphics", text: "Animated type, logo animation and visual effects that lift every frame." },
  { title: "Brand & Promotional Videos", text: "Product promos, business ads and marketing creatives that sell the idea." },
];

export const aiCapabilities = [
  "AI Video Generation",
  "AI Image Generation",
  "AI Voiceovers",
  "AI-Assisted Storytelling",
  "Generative Visual Effects",
  "Automated Content Workflows",
  "Creative Concept Development",
];

export const workflow = [
  { title: "Understand the Vision", text: "What the video must do, who it is for, and where it will live." },
  { title: "Creative Research & Concept", text: "References, the hook, and a structure that earns the next second." },
  { title: "Editing & Storytelling", text: "Pace, rhythm and cuts that carry the story forward." },
  { title: "Motion Graphics & Sound Design", text: "Type, animation and audio layered in to lift every beat." },
  { title: "Final Color & Quality Check", text: "A consistent grade, clean audio and a frame-by-frame review." },
  { title: "Delivery", text: "Final files, exported for every platform they need to run on." },
];

export const craftWords = ["Cut", "Colour", "Motion", "Sound", "Story", "Rhythm", "Type", "Grade"];

export const chapters = [
  { id: "top", label: "Open" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "ai", label: "AI" },
  { id: "workflow", label: "Workflow" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
