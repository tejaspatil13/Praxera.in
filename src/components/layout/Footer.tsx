import Link from "next/link";
import { nav, site } from "@/content/site";
import { services } from "@/content/services";
import { callList, leadKaro } from "@/content/caseStudies";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const legal = site.legal;
  return (
    <footer className="on-dark bg-midnight-950 text-slate-300">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Wordmark tone="dark" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">{site.tagline}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
            AI, automation, integrations and custom software for businesses in India, the UK, the USA and beyond.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-8">
          <div>
            <h2 className="eyebrow text-slate-500">Company</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-slate-500">Services</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.slice(0, 7).map((s) => (
                <li key={s.id}>
                  <Link href={`/services#${s.id}`} className="hover:text-white">
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h2 className="eyebrow text-slate-500">Case studies</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href={callList.href} className="hover:text-white">
                  UK call-list automation
                </Link>
              </li>
              <li>
                <Link href={leadKaro.href} className="hover:text-white">
                  LeadKaro lead generation
                </Link>
              </li>
            </ul>
            <h2 className="eyebrow mt-8 text-slate-500">Contact</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white">
                  Send an enquiry
                </Link>
              </li>
              {site.publicEmail && (
                <li>
                  <a href={`mailto:${site.publicEmail}`} className="hover:text-white">
                    {site.publicEmail}
                  </a>
                </li>
              )}
              <li>
                <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  WhatsApp {site.whatsapp.display}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t border-white/5">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>
              © {site.copyrightYear} {legal.entityName ?? site.name}. All rights reserved.
            </p>
            {legal.entityName && (
              <p>
                {legal.registrationNumber && <>Registration no. {legal.registrationNumber}. </>}
                {legal.registeredAddress && <>Registered address: {legal.registeredAddress}.</>}
              </p>
            )}
          </div>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
