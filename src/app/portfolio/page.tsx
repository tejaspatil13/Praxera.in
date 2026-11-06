import { Suspense } from "react";
import type { Metadata } from "next";
import { Anton, Instrument_Serif } from "next/font/google";
import { connection } from "next/server";
import { About } from "@/components/portfolio/About";
import { AiSection } from "@/components/portfolio/AiSection";
import { Contact } from "@/components/portfolio/Contact";
import { Cursor } from "@/components/portfolio/Cursor";
import { FilmGrain, SpeedMarquee, ZoomThrough } from "@/components/portfolio/Effects";
import { Hero } from "@/components/portfolio/Hero";
import { Services } from "@/components/portfolio/Services";
import { Timeline } from "@/components/portfolio/Timeline";
import { Workflow } from "@/components/portfolio/Workflow";
import { WorkGallery, WorkSkeleton } from "@/components/portfolio/WorkGallery";
import { profile } from "@/content/portfolio";
import { site } from "@/content/site";
import { canonical } from "@/lib/seo";
import { publicVideos } from "@/lib/videos";

const poster = Anton({ variable: "--font-poster", subsets: ["latin"], weight: "400", display: "swap" });
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: "italic", display: "swap" });

const title = "Tejas Patil | Video Editor & AI-Powered Creative Producer – Praxera Technologies";
const description = "Scroll-stopping Instagram reels, cinematic brand films, motion graphics and AI-powered video production by Tejas Patil at Praxera Technologies.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: canonical("/portfolio"),
  openGraph: { title, description, url: "/portfolio", type: "profile" },
  twitter: { card: "summary_large_image", title, description },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.roles[0],
  worksFor: { "@type": "Organization", name: site.name },
  sameAs: [profile.linkedin, profile.github, profile.instagram],
};

async function WorkFromAdmin() {
  await connection();
  return <WorkGallery videos={await publicVideos()} />;
}

export default function PortfolioPage() {
  return (
    <div data-bare className={`pf on-dark relative ${poster.variable} ${serif.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }} />
      <FilmGrain />
      <Cursor />
      <Timeline />
      <main>
        <Hero />
        <ZoomThrough />
        <Suspense fallback={<WorkSkeleton />}>
          <WorkFromAdmin />
        </Suspense>
        <SpeedMarquee />
        <Services />
        <AiSection />
        <SpeedMarquee direction={-1} />
        <Workflow />
        <About />
        <Contact />
      </main>
    </div>
  );
}
