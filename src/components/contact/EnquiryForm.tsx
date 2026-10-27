"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { interests, isInterest } from "@/content/interests";
import { countryOptions, PRIORITY_COUNT } from "@/content/countries";
import { contactMethods, enquiryRows, enquirySchema, enquirySubject, fieldErrors, MIN_FILL_MS, type Enquiry } from "@/lib/enquiry";
import { useRegion } from "@/components/region/RegionProvider";
import { CurrencyNote } from "@/components/pricing/PricingCards";
import { site } from "@/content/site";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const labelCls = "block text-sm font-semibold text-midnight-900";
const inputCls =
  "mt-1.5 block w-full rounded-lg border bg-white px-3.5 py-2.5 text-[0.95rem] text-ink shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus-visible:border-accent-strong focus-visible:ring-2 focus-visible:ring-accent-strong/25";

function Field({
  id,
  label,
  optional,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label} {optional && <span className="font-normal text-slate-500">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm text-danger">
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const errorsPresent = (e: Record<string, string>) => Object.keys(e).length > 0;

/** Public Web3Forms access key (designed to be exposed in the browser). */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Result = { ok: boolean; message?: string; fields?: Record<string, string> };

/** Delivers straight from the browser to Web3Forms, which emails hello@praxera.in. */
async function sendViaWeb3Forms(e: Enquiry, key: string): Promise<Result> {
  if (Date.now() - e.startedAt < MIN_FILL_MS) {
    return { ok: false, message: "That was very quick — please wait a moment and send again." };
  }
  // Plain FormData with no custom headers keeps this a CORS "simple request" (no preflight).
  const body = new FormData();
  const fields: Record<string, string> = {
    access_key: key,
    subject: `${enquirySubject(e)} — ${site.name}`,
    from_name: `${site.name} website`,
    replyto: e.email,
    botcheck: e.website,
    ...Object.fromEntries(enquiryRows(e)),
    "What they want to improve": e.message,
  };
  for (const [k, v] of Object.entries(fields)) body.append(k, v);
  const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
  return res.ok && data.success ? { ok: true } : { ok: false, message: "Your enquiry could not be delivered. Please try again shortly." };
}

/** Delivers through this site's /api/enquiry route (Resend, or FormSubmit as a fallback). */
async function sendViaApi(payload: unknown): Promise<Result> {
  const res = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; fields?: Record<string, string> };
  return { ok: res.ok && !!data.ok, message: data.message, fields: data.fields };
}

export function EnquiryForm() {
  const params = useSearchParams();
  const { region, country: detectedCountry } = useRegion();
  const countries = useMemo(() => countryOptions(), []);
  const initialInterest = params.get("interest");

  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    country: "",
    interest: isInterest(initialInterest) ? initialInterest : "",
    message: "",
    contactMethod: "email" as keyof typeof contactMethods,
    phone: "",
    consent: false,
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const startedAt = useRef<number>(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Prefill country from the host-reported location until the visitor chooses one.
  const country = values.country || detectedCountry || "";

  const set = <K extends keyof typeof values>(key: K, v: (typeof values)[K]) => {
    setValues((s) => ({ ...s, [key]: v }));
    if (errors[key as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  };

  const describedBy = (id: string, hint?: boolean) =>
    errors[id] ? `${id}-error` : hint ? `${id}-hint` : undefined;

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (status.kind === "submitting") return;

    const payload = {
      ...values,
      country,
      interest: values.interest || undefined,
      currency: region.currency,
      startedAt: startedAt.current,
    };
    const check = enquirySchema.safeParse(payload);
    if (!check.success) {
      const errs = fieldErrors(check.error);
      setErrors(errs);
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus({ kind: "submitting" });
    try {
      const result = WEB3FORMS_KEY ? await sendViaWeb3Forms(check.data, WEB3FORMS_KEY) : await sendViaApi(payload);
      if (result.ok) {
        setStatus({ kind: "success" });
      } else {
        if (result.fields) setErrors(result.fields);
        setStatus({ kind: "error", message: result.message ?? "Your enquiry could not be sent. Please try again." });
      }
    } catch {
      setStatus({ kind: "error", message: "We could not reach the server. Check your connection and try again." });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status.kind === "success") {
    return (
      <motion.div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-success/30 bg-white p-8 shadow-card"
      >
        <CheckCircle2 aria-hidden className="h-10 w-10 text-success" />
        <h2 className="mt-4 font-display text-2xl font-bold text-midnight-900">Thank you — your enquiry has been sent.</h2>
        <p className="mt-3 leading-relaxed text-slate-600">
          {site.founder.name} will read it personally and reply by your preferred contact method
          {values.contactMethod === "email" ? ` at ${values.email}` : ""}.
        </p>
        <Link href="/case-studies" className="mt-6 inline-block text-sm font-semibold text-accent-strong hover:underline">
          Explore our case studies while you wait →
        </Link>
      </motion.div>
    );
  }

  const showPhone = values.contactMethod !== "email";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6" aria-describedby="form-privacy">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            className={`${inputCls} ${errors.name ? "border-danger" : "border-line"}`}
          />
        </Field>
        <Field id="email" label="Business email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            className={`${inputCls} ${errors.email ? "border-danger" : "border-line"}`}
          />
        </Field>
        <Field id="company" label="Company name" optional error={errors.company}>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            aria-invalid={!!errors.company}
            aria-describedby={describedBy("company")}
            className={`${inputCls} ${errors.company ? "border-danger" : "border-line"}`}
          />
        </Field>
        <Field id="country" label="Country" error={errors.country}>
          <select
            id="country"
            name="country"
            autoComplete="country"
            required
            value={country}
            onChange={(e) => set("country", e.target.value)}
            aria-invalid={!!errors.country}
            aria-describedby={describedBy("country")}
            className={`${inputCls} ${errors.country ? "border-danger" : "border-line"}`}
          >
            <option value="">Choose your country</option>
            <optgroup label="Common">
              {countries.slice(0, PRIORITY_COUNT).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="All countries">
              {countries.slice(PRIORITY_COUNT).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          </select>
        </Field>
      </div>

      <Field id="interest" label="What is this about?" optional error={errors.interest}>
        <select
          id="interest"
          name="interest"
          value={values.interest}
          onChange={(e) => set("interest", e.target.value as typeof values.interest)}
          className={`${inputCls} border-line`}
        >
          <option value="">Choose an area</option>
          {Object.entries(interests).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id="message"
        label="What would you like to improve?"
        error={errors.message}
        hint="A sentence is enough. Add the tools involved and what takes the most time, if you can."
      >
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={3000}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message", true)}
          className={`${inputCls} resize-y ${errors.message ? "border-danger" : "border-line"}`}
        />
      </Field>

      <fieldset>
        <legend className={labelCls}>Preferred contact method</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(contactMethods) as (keyof typeof contactMethods)[]).map((m) => (
            <label
              key={m}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors has-focus-visible:ring-2 has-focus-visible:ring-accent-strong ${
                values.contactMethod === m
                  ? "border-midnight-900 bg-midnight-900 text-white"
                  : "border-line bg-white text-slate-600 hover:border-slate-400"
              }`}
            >
              <input
                type="radio"
                name="contactMethod"
                value={m}
                checked={values.contactMethod === m}
                onChange={() => set("contactMethod", m)}
                className="sr-only"
              />
              {contactMethods[m]}
            </label>
          ))}
        </div>
      </fieldset>

      <AnimatePresence initial={false}>
        {showPhone && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Field id="phone" label="Phone or WhatsApp number" error={errors.phone} hint="Include the country code.">
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(e) => set("phone", e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={describedBy("phone", true)}
                className={`${inputCls} ${errors.phone ? "border-danger" : "border-line"}`}
              />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Honeypot: hidden from people and assistive technology */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-accent-strong"
          />
          <span>
            I agree that Praxera Technologies may use these details to respond to my enquiry, as described in the{" "}
            <Link href="/privacy" className="font-medium text-accent-strong underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-1.5 flex items-start gap-1.5 text-sm text-danger">
            <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
            {errors.consent}
          </p>
        )}
      </div>

      <CurrencyNote />

      <div ref={statusRef} tabIndex={-1} aria-live="assertive" className="focus:outline-none">
        {status.kind === "error" && (
          <div role="alert" className="rounded-xl border border-danger/30 bg-red-50 p-4 text-sm text-danger">
            <p className="flex items-start gap-2 font-semibold">
              <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
              {status.message}
            </p>
            {!errorsPresent(errors) && (
              <p className="mt-2 pl-6 text-slate-700">
                You can also email{" "}
                <a href={`mailto:${site.publicEmail}`} className="font-semibold underline">
                  {site.publicEmail}
                </a>{" "}
                or message us on{" "}
                <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                  WhatsApp {site.whatsapp.display}
                </a>
                .
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={status.kind === "submitting"}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-midnight-900 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status.kind === "submitting" ? (
          <>
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send enquiry <Send aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
      <p id="form-privacy" className="text-xs leading-relaxed text-slate-500">
        We collect only what is needed to reply to you. Your details are never sold or added to marketing lists.
      </p>
    </form>
  );
}
