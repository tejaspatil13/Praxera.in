"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, MessageCircle, Mic, Send, Square } from "lucide-react";
import { budgets, currencies, needs, voiceLanguages, type BudgetCurrency } from "@/content/requirements";
import { fieldErrors, WEB3FORMS_KEY } from "@/lib/enquiry";
import { MIN_FILL_MS, requirementRows, requirementSchema, requirementText, toAnswers, type RequirementAnswers } from "@/lib/requirements";
import { useRegion } from "@/components/region/RegionProvider";
import { site } from "@/content/site";
import { useVoice } from "./useVoice";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success" } | { kind: "error"; message: string } | { kind: "handoff"; text: string };

const ease = [0.22, 1, 0.36, 1] as const;
const labelCls = "block text-[0.95rem] font-semibold text-midnight-900";
const inputCls =
  "mt-1.5 block w-full rounded-xl border bg-mist/60 px-4 py-3 text-base text-ink transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:bg-white focus:outline-none focus-visible:border-accent-strong focus-visible:ring-4 focus-visible:ring-accent/20";

const steps = [
  { label: "About you", title: "First, about you", hint: "So we know who we are talking to.", fields: ["name", "whatsapp", "business", "email", "link"] },
  { label: "Your problem", title: "Your business and problem", hint: "A few simple lines are enough.", fields: ["about", "problem", "today", "needs"] },
  { label: "Budget", title: "Your budget", hint: "This helps us suggest the right size of solution.", fields: ["currency", "budget"] },
];

const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease, staggerChildren: 0.05, delayChildren: 0.05 } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -48, transition: { duration: 0.18, ease: "easeIn" } }),
};

const item: Variants = {
  enter: { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

function ErrorText({ id, error }: { id: string; error?: string }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-start gap-1.5 overflow-hidden pt-1.5 text-sm text-danger"
        >
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/** A tick that pops in beside a question once it has an answer. */
function Done({ show }: { show: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.span
          aria-hidden
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-midnight-900"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function Label({ id, text, optional, done }: { id?: string; text: string; optional?: boolean; done?: boolean }) {
  const Tag = id ? "label" : "span";
  return (
    <Tag {...(id ? { htmlFor: id } : {})} className={`${labelCls} flex min-h-6 items-center gap-2`}>
      <span>
        {text} {optional && <span className="font-normal text-slate-500">(optional)</span>}
      </span>
      <Done show={!!done} />
    </Tag>
  );
}

function Chip({ type, name, label, checked, onChange }: { type: "radio" | "checkbox"; name: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <motion.label
      whileTap={{ scale: 0.95 }}
      className={`relative cursor-pointer select-none overflow-hidden rounded-full border px-4 py-2.5 text-sm font-medium transition-colors has-focus-visible:ring-2 has-focus-visible:ring-accent-strong ${
        checked ? "border-midnight-900 text-white" : "border-line bg-white text-slate-600 hover:border-accent-strong hover:text-midnight-900"
      }`}
    >
      {checked && <motion.span aria-hidden initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.1, opacity: 1 }} transition={{ duration: 0.3, ease }} className="absolute inset-0 rounded-full bg-midnight-900" />}
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className="relative flex items-center gap-1.5">
        {checked && <Check aria-hidden className="h-3.5 w-3.5 text-accent" strokeWidth={3} />}
        {label}
      </span>
    </motion.label>
  );
}

function VoiceBars() {
  return (
    <span aria-hidden className="flex h-4 items-center gap-0.5">
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-0.5 rounded-full bg-white"
          animate={{ height: [4, 14, 6, 12, 4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </span>
  );
}

export function RequirementsForm() {
  const { region } = useRegion();
  const [values, setValues] = useState({
    name: "",
    whatsapp: "",
    email: "",
    business: "",
    link: "",
    about: "",
    problem: "",
    today: "",
    needs: [] as string[],
    currency: "" as BudgetCurrency | "",
    budget: "",
    website: "",
  });
  const [lang, setLang] = useState<string>(voiceLanguages[0].code);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const voice = useVoice(lang);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Follow the visitor's region until they choose a currency.
  const currency = values.currency || (region.currency as BudgetCurrency);
  const payload = () => ({ ...values, currency, startedAt: startedAt.current });

  const filled = (v: string) => v.trim().length >= 2;
  const answered = [
    [filled(values.name), filled(values.whatsapp)],
    [filled(values.about), filled(values.problem), values.needs.length > 0],
    [!!values.budget],
  ];

  type Key = keyof typeof values;
  const set = <K extends Key>(key: K, v: (typeof values)[K]) => {
    setValues((s) => ({ ...s, [key]: v }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const goTo = (next: number) => {
    voice.stop();
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Shows only the errors that belong to the given step. Returns true when that step is complete. */
  function validateStep(index: number) {
    const check = requirementSchema.safeParse(payload());
    const all = check.success ? {} : fieldErrors(check.error);
    const errs = Object.fromEntries(Object.entries(all).filter(([k]) => steps[index].fields.includes(k)));
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    return !first;
  }

  async function send() {
    if (status.kind === "submitting") return;
    voice.stop();

    const check = requirementSchema.safeParse(payload());
    if (!check.success) {
      validateStep(step);
      return;
    }
    if (Date.now() - check.data.startedAt < MIN_FILL_MS) {
      setStatus({ kind: "error", message: "That was very quick — please wait a moment and send again." });
      return;
    }

    setErrors({});
    setStatus({ kind: "submitting" });
    const answers = toAnswers(check.data);

    let saved = false;
    try {
      const res = await fetch("/api/requirements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(check.data) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string; fields?: Record<string, string> };
      if (data.fields || data.error === "too_fast" || data.error === "rate_limited") {
        if (data.fields) setErrors(data.fields);
        setStatus({ kind: "error", message: data.message ?? "Please check the form and try again." });
        return;
      }
      saved = res.ok && !!data.ok;
    } catch {
      // Falls through to the email copy below.
    }

    const emailed = await emailCopy(answers, check.data.website).catch(() => false);
    setStatus(saved || emailed ? { kind: "success" } : { kind: "handoff", text: requirementText(answers) });
  }

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!validateStep(step)) return;
    if (step < steps.length - 1) goTo(step + 1);
    else void send();
  }

  const voiceField = (key: "about" | "problem" | "today", label: string, placeholder: string, rows: number, optional?: boolean) => {
    const listening = voice.active === key;
    const max = key === "about" ? 2000 : 3000;
    return (
      <motion.div variants={item}>
        <div className="flex items-center justify-between gap-3">
          <Label id={key} text={label} optional={optional} done={values[key].trim().length >= 5} />
          {voice.supported && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => (listening ? voice.stop() : voice.start(key, values[key], (t) => set(key, t.slice(0, max))))}
              aria-pressed={listening}
              aria-label={listening ? `Stop speaking your answer: ${label}` : `Speak your answer: ${label}`}
              className={`relative inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
                listening ? "bg-danger text-white" : "bg-accent-soft text-accent-deep hover:bg-accent hover:text-midnight-900"
              }`}
            >
              {listening && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-danger/40" />}
              {listening ? <Square aria-hidden className="relative h-3.5 w-3.5 fill-current" /> : <Mic aria-hidden className="h-4 w-4" />}
              <span className="relative">{listening ? "Stop" : "Speak"}</span>
              {listening && <VoiceBars />}
            </motion.button>
          )}
        </div>
        <textarea
          id={key}
          name={key}
          rows={rows}
          maxLength={max}
          placeholder={placeholder}
          value={values[key]}
          readOnly={listening}
          onChange={(e) => set(key, e.target.value)}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
          className={`${inputCls} resize-y ${listening ? "border-danger ring-4 ring-danger/10" : errors[key] ? "border-danger" : "border-line"}`}
        />
        <ErrorText id={key} error={errors[key]} />
      </motion.div>
    );
  };

  const textField = (key: "name" | "whatsapp" | "email" | "business" | "link", label: string, props: React.InputHTMLAttributes<HTMLInputElement>, optional?: boolean) => (
    <motion.div variants={item}>
      <Label id={key} text={label} optional={optional} done={filled(values[key])} />
      <input
        id={key}
        name={key}
        value={values[key]}
        onChange={(e) => set(key, e.target.value)}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        className={`${inputCls} ${errors[key] ? "border-danger" : "border-line"}`}
        {...props}
      />
      <ErrorText id={key} error={errors[key]} />
    </motion.div>
  );

  const finished = status.kind === "success" || status.kind === "handoff";
  const last = step === steps.length - 1;

  return (
    <motion.section
      aria-label="Project requirements form"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
      className="flex flex-1 flex-col rounded-t-[1.75rem] bg-white text-ink shadow-[0_-20px_60px_-20px_rgb(0_0_0/0.6)] lg:flex-none lg:self-start lg:rounded-3xl lg:shadow-2xl"
    >
      {finished ? (
        <motion.div role="status" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }} className="m-auto p-8 text-center sm:p-12">
          {status.kind === "success" ? (
            <>
              <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.15 }} className="inline-flex">
                <CheckCircle2 aria-hidden className="h-16 w-16 text-accent-strong" />
              </motion.span>
              <h2 className="mt-5 font-display text-3xl font-bold text-midnight-900">Thank you, {values.name.trim().split(" ")[0]}!</h2>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-600">We have your requirements. We will read them and reply to you on WhatsApp with the next steps.</p>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold text-midnight-900">One more tap to send this</h2>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-600">We could not send it automatically just now. Your answers are ready, so just press send in WhatsApp.</p>
              <a
                href={`${site.whatsapp.href}?text=${encodeURIComponent(status.kind === "handoff" ? status.text : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-success px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle aria-hidden className="h-5 w-5" /> Send on WhatsApp
              </a>
            </>
          )}
        </motion.div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
          <div className="px-5 pt-4 sm:px-8 sm:pt-7">
            <ol className="grid grid-cols-3 gap-2">
              {steps.map((s, i) => {
                const fill = answered[i].filter(Boolean).length / answered[i].length;
                return (
                  <li key={s.label}>
                    <button
                      type="button"
                      disabled={i >= step}
                      onClick={() => goTo(i)}
                      aria-current={i === step ? "step" : undefined}
                      className={`block w-full text-left text-xs font-semibold transition-colors disabled:cursor-default ${i === step ? "text-midnight-900" : i < step ? "text-accent-strong hover:text-midnight-900" : "text-slate-400"}`}
                    >
                      <span className="block h-1.5 overflow-hidden rounded-full bg-mist-2">
                        <motion.span className="block h-full rounded-full bg-gradient-to-r from-accent-strong to-accent" initial={false} animate={{ width: `${Math.max(fill, i < step ? 1 : 0) * 100}%` }} transition={{ duration: 0.5, ease }} />
                      </span>
                      <span className="mt-2 block">{s.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="flex-1 overflow-x-clip px-5 py-5 sm:px-8 sm:py-6">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div key={step} custom={direction} variants={slide} initial="enter" animate="center" exit="exit" className="space-y-5">
                <motion.div variants={item}>
                  <p className="font-mono text-xs tracking-widest text-accent-strong">STEP {step + 1} OF {steps.length}</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-midnight-900">{steps[step].title}</h2>
                  <p className="mt-0.5 hidden text-sm text-slate-500 sm:block">{step === 1 && voice.supported ? "Tap Speak and just talk. We will type it for you." : steps[step].hint}</p>
                </motion.div>

                {step === 0 && (
                  <>
                    {textField("name", "Your name", { autoComplete: "name", placeholder: "Rahul Sharma" })}
                    {textField("whatsapp", "WhatsApp number", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "+91 98765 43210" })}
                    {textField("business", "Business name", { autoComplete: "organization", placeholder: "Sharma Dental Clinic" }, true)}
                    <div className="grid gap-5 sm:grid-cols-2">
                      {textField("email", "Email", { type: "email", inputMode: "email", autoComplete: "email", placeholder: "you@business.com" }, true)}
                      {textField("link", "Website or Instagram", { inputMode: "url", placeholder: "instagram.com/you" }, true)}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <motion.div variants={item}>
                      {voice.supported ? (
                        <fieldset className="flex flex-wrap items-center gap-2">
                          <legend className="sr-only">Language you will speak in</legend>
                          {voiceLanguages.map((l) => (
                            <Chip
                              key={l.code}
                              type="radio"
                              name="voiceLanguage"
                              label={l.label}
                              checked={lang === l.code}
                              onChange={() => {
                                voice.stop();
                                setLang(l.code);
                              }}
                            />
                          ))}
                        </fieldset>
                      ) : (
                        <p className="flex items-center gap-2 rounded-xl bg-accent-soft/60 px-4 py-3 text-sm text-accent-deep">
                          <Mic aria-hidden className="h-4 w-4 shrink-0" /> Prefer to talk? Use the mic on your phone keyboard.
                        </p>
                      )}
                      {voice.error && (
                        <p role="alert" className="mt-2 flex items-start gap-1.5 text-sm text-danger">
                          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                          {voice.error}
                        </p>
                      )}
                    </motion.div>
                    {voiceField("about", "What does your business do?", "We are a dental clinic in Nashik with 2 doctors…", 2)}
                    {voiceField("problem", "What problem do you want to solve?", "We miss patient calls and many patients don’t come back…", 3)}
                    {voiceField("today", "How do you handle this today?", "We use a notebook and WhatsApp. It takes 2 hours a day…", 2, true)}
                    <motion.fieldset variants={item}>
                      <legend className="w-full">
                        <Label text="What do you think you need?" done={values.needs.length > 0} />
                      </legend>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {needs.map((n) => (
                          <Chip key={n} type="checkbox" name="needs" label={n} checked={values.needs.includes(n)} onChange={() => set("needs", values.needs.includes(n) ? values.needs.filter((x) => x !== n) : [...values.needs, n])} />
                        ))}
                      </div>
                      <ErrorText id="needs" error={errors.needs} />
                    </motion.fieldset>
                  </>
                )}

                {step === 2 && (
                  <>
                    <motion.fieldset variants={item}>
                      <legend className="w-full">
                        <Label text="What is your budget?" done={!!values.budget} />
                      </legend>
                      <div className="mt-2.5 inline-flex rounded-full bg-mist p-1">
                        {currencies.map((c) => (
                          <label key={c.code} className="relative cursor-pointer rounded-full px-3 py-2 text-sm font-semibold has-focus-visible:ring-2 has-focus-visible:ring-accent-strong sm:px-3.5">
                            {currency === c.code && <motion.span aria-hidden layoutId="currency-pill" transition={{ type: "spring", stiffness: 420, damping: 32 }} className="absolute inset-0 rounded-full bg-midnight-900" />}
                            <input
                              type="radio"
                              name="currency"
                              checked={currency === c.code}
                              onChange={() => {
                                set("currency", c.code);
                                set("budget", "");
                              }}
                              className="sr-only"
                            />
                            <span className={`relative whitespace-nowrap transition-colors ${currency === c.code ? "text-white" : "text-slate-600"}`}>{c.label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {budgets[currency].map((b) => (
                          <Chip key={b} type="radio" name="budget" label={b} checked={values.budget === b} onChange={() => set("budget", b)} />
                        ))}
                      </div>
                      <ErrorText id="budget" error={errors.budget} />
                    </motion.fieldset>

                    <motion.p variants={item} className="text-xs leading-relaxed text-slate-500">
                      We use these details only to understand your needs and reply to you, as described in our{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-accent-strong underline underline-offset-2">
                        Privacy Policy
                      </a>
                      . We never sell your details.
                    </motion.p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Honeypot: hidden from people and assistive technology */}
            <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Leave this field empty</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
            </div>

            {status.kind === "error" && (
              <div role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-danger/30 bg-red-50 p-4 text-sm font-semibold text-danger">
                <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                {status.message}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 z-10 flex items-center gap-3 border-t border-line bg-white/95 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-8 lg:rounded-b-3xl">
            {step > 0 && (
              <motion.button
                type="button"
                aria-label="Back"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => goTo(step - 1)}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-midnight-900 transition-colors hover:border-midnight-900"
              >
                <ArrowLeft aria-hidden className="h-5 w-5" />
              </motion.button>
            )}
            <motion.button
              key={last ? "send" : "next"}
              type="submit"
              disabled={status.kind === "submitting"}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className={`group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${last ? "bg-accent-strong hover:bg-accent-deep" : "bg-midnight-900 hover:bg-accent-strong"}`}
            >
              {status.kind === "submitting" ? (
                <>
                  <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> Sending…
                </>
              ) : last ? (
                <>
                  Send my requirements <Send aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              ) : (
                <>
                  Next <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      )}
    </motion.section>
  );
}

/** A copy to hello@praxera.in, sent from the browser. It alerts us to a new lead and backs up the database. */
async function emailCopy(answers: RequirementAnswers, botcheck: string) {
  const body = new FormData();
  const fields: Record<string, string> = {
    access_key: WEB3FORMS_KEY,
    subject: `New requirements from ${answers.name}${answers.business ? ` (${answers.business})` : ""}`,
    from_name: `${site.name} website`,
    botcheck,
    ...(answers.email ? { replyto: answers.email } : {}),
    ...Object.fromEntries(requirementRows(answers)),
  };
  for (const [k, v] of Object.entries(fields)) body.append(k, v);
  const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return res.ok && !!data.success;
}
