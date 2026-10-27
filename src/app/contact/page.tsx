import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { site } from "@/content/site";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Discuss your project with Praxera Technologies. Tell us which process you want to improve.",
  alternates: canonical("/contact"),
};

const next = [
  { t: "You describe the process", b: "What happens today, which tools are involved, and what takes the most time." },
  { t: "Our team reviews it", b: "Every enquiry is read and reviewed by our team." },
  { t: "We reply with next steps", b: "Usually a short discovery conversation to understand your workflow before suggesting anything." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Discuss your project."
        intro="Tell us which process you want to improve. No obligation, and no sales sequence — just a direct reply from the founder."
      />
      <section className="bg-mist py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="relative rounded-3xl border border-line bg-white p-6 shadow-card sm:p-10 lg:col-span-8">
            <Suspense fallback={<p className="text-slate-500">Loading the enquiry form…</p>}>
              <EnquiryForm />
            </Suspense>
          </div>
          <aside className="space-y-8 lg:col-span-4">
            <div>
              <h2 className="font-display text-lg font-bold text-midnight-900">What happens next</h2>
              <ol className="mt-5 space-y-5">
                {next.map((n, i) => (
                  <li key={n.t} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-midnight-900 font-mono text-xs text-accent">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-midnight-900">{n.t}</p>
                      <p className="mt-0.5 text-sm text-slate-600">{n.b}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="font-display font-bold text-midnight-900">Prefer to contact us directly?</h2>
              <ul className="mt-4 space-y-3">
                {site.publicEmail && (
                  <li>
                    <a
                      href={`mailto:${site.publicEmail}`}
                      className="group flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:border-accent-strong/50 hover:bg-mist"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-midnight-900 text-accent">
                        <Mail aria-hidden className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-xs text-slate-500">Email</span>
                        <span className="block font-semibold text-midnight-900 group-hover:text-accent-strong">{site.publicEmail}</span>
                      </span>
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href={site.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:border-accent-strong/50 hover:bg-mist"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success text-white">
                      <MessageCircle aria-hidden className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-xs text-slate-500">WhatsApp</span>
                      <span className="block font-semibold text-midnight-900 group-hover:text-accent-strong">{site.whatsapp.display}</span>
                    </span>
                    <span className="sr-only">(opens WhatsApp in a new tab)</span>
                  </a>
                </li>
              </ul>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              There is no online booking calendar. Once we have your enquiry, we will agree a time for a call that suits
              you.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
