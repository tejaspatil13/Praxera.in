"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, ClipboardCopy, Loader2, Lock, Trash2 } from "lucide-react";
import { login, removeRequirement } from "@/app/admin/actions";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-midnight-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-70">
      {pending ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Lock aria-hidden className="h-4 w-4" />} Sign in
    </button>
  );
}

export function LoginForm() {
  const [error, action] = useActionState(login, "");
  return (
    <form action={action} className="mx-auto mt-16 max-w-sm rounded-3xl border border-line bg-white p-8 shadow-card">
      <h1 className="font-display text-2xl font-bold text-midnight-900">Admin sign in</h1>
      <label htmlFor="password" className="mt-6 block text-sm font-semibold text-midnight-900">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="mt-1.5 block w-full rounded-lg border border-line px-3.5 py-2.5 focus:outline-none focus-visible:border-accent-strong focus-visible:ring-2 focus-visible:ring-accent-strong/25"
      />
      {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
      <LoginButton />
    </form>
  );
}

export function CopyBrief({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-2 rounded-full bg-midnight-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
    >
      {copied ? <Check aria-hidden className="h-4 w-4" /> : <ClipboardCopy aria-hidden className="h-4 w-4" />}
      {copied ? "Copied" : "Copy proposal brief"}
    </button>
  );
}

export function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={removeRequirement}
      onSubmit={(e) => {
        if (!window.confirm("Delete this requirement permanently? This cannot be undone.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="inline-flex items-center gap-2 text-sm font-semibold text-danger hover:underline">
        <Trash2 aria-hidden className="h-4 w-4" /> Delete
      </button>
    </form>
  );
}
