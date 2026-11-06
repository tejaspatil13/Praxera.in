"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { profile } from "@/content/portfolio";
import { WEB3FORMS_KEY } from "@/lib/enquiry";
import { site } from "@/content/site";
import { Magnetic, MaskedLines, SectionLabel } from "./shared";

const fieldCls = "mt-2 block w-full border-b border-white/25 bg-transparent py-2.5 text-base text-white placeholder:text-slate-500 focus:border-accent focus:outline-none";

const links = [
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Instagram", href: profile.instagram },
  { label: "GitHub", href: profile.github },
  { label: "WhatsApp", href: site.whatsapp.href },
];

function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setState("sending");
    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", `Portfolio enquiry from ${data.get("name")}`);
    data.append("from_name", `${site.name} portfolio`);
    data.append("replyto", String(data.get("email")));
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const body = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || !body.success) throw new Error();
      setState("sent");
      form.current?.reset();
    } catch {
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <p role="status" className="flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-6 text-lg">
        <CheckCircle2 aria-hidden className="h-6 w-6 shrink-0 text-accent" /> Thanks. Your message is on its way, and I’ll reply soon.
      </p>
    );
  }

  return (
    <form ref={form} onSubmit={submit} className="space-y-6">
      <input type="checkbox" name="botcheck" hidden tabIndex={-1} autoComplete="off" />
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm text-slate-300">
          Your name
          <input name="name" required minLength={2} maxLength={100} autoComplete="name" className={fieldCls} />
        </label>
        <label className="text-sm text-slate-300">
          Your email
          <input name="email" type="email" required maxLength={200} autoComplete="email" className={fieldCls} />
        </label>
      </div>
      <label className="block text-sm text-slate-300">
        Your idea
        <textarea name="message" required rows={3} maxLength={3000} placeholder="What do you want to make?" className={`${fieldCls} resize-none`} />
      </label>
      {state === "failed" ? (
        <p role="alert" className="text-sm text-[#ff8a8a]">
          That didn’t send. Please email <a href={`mailto:${profile.email}`} className="underline">{profile.email}</a> instead.
        </p>
      ) : null}
      <button disabled={state === "sending"} className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-[var(--pf-bg)] transition-colors hover:bg-[#f6f0e6] disabled:opacity-60">
        {state === "sending" ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : null} Send message
      </button>
    </form>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-[var(--pf-line)] pb-24 lg:pb-16">
      <div aria-hidden className="overflow-hidden border-b border-[var(--pf-line)] py-3">
        <div className="pf-marquee flex w-max gap-10 font-mono text-xs uppercase tracking-[0.3em] text-[var(--pf-dim)]">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i}>Open for video editing work ✦</span>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-[96rem] px-5 pt-20 lg:px-10 lg:pt-28">
        <SectionLabel index="06">Let’s collaborate</SectionLabel>
        <h2 id="contact-title" className="pf-poster mt-5 text-[clamp(3.2rem,11vw,10.5rem)]">
          <MaskedLines lines={["Have an idea?", <span key="v" className="text-accent">Let’s make it visual.</span>]} />
        </h2>
        <div className="mt-14 grid gap-14 lg:grid-cols-2">
          <div>
            <Magnetic href={`mailto:${profile.email}`}>
              <Mail aria-hidden className="h-4 w-4" /> {profile.email}
            </Magnetic>
            <ul className="mt-9 max-w-sm border-t border-[var(--pf-line)]">
              {links.map((l) => (
                <li key={l.label} className="border-b border-[var(--pf-line)]">
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-3 font-display text-lg font-semibold transition-colors hover:text-accent">
                    {l.label} <ArrowUpRight aria-hidden className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ContactForm />
        </div>
        <footer className="mt-20 flex flex-wrap justify-between gap-3 border-t border-[var(--pf-line)] pt-6 text-sm text-[var(--pf-dim)]">
          <p>© {site.copyrightYear} {site.name}. {profile.location}.</p>
          <Link href="/" className="hover:text-accent">praxera.in</Link>
        </footer>
      </div>
    </section>
  );
}
