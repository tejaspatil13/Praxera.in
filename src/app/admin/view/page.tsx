import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { updateNotes, updateStatus } from "../actions";
import { CopyBrief, DeleteButton } from "@/components/admin/AdminControls";
import { formatDate, statusStyles } from "@/components/admin/AdminNotice";
import { isAdmin } from "@/lib/adminAuth";
import { dbConfigured, getRequirement } from "@/lib/db";
import { proposalBrief, requirementRows, statuses, whatsappHref, type RequirementStatus } from "@/lib/requirements";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function Detail({ searchParams }: { searchParams: PageProps<"/admin/view">["searchParams"] }) {
  await connection();
  if (!(await isAdmin()) || !dbConfigured()) redirect("/admin");
  const { id } = await searchParams;
  if (typeof id !== "string" || !UUID.test(id)) notFound();
  const r = await getRequirement(id);
  if (!r) notFound();

  return (
    <>
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-midnight-900">
        <ArrowLeft aria-hidden className="h-4 w-4" /> All requirements
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-midnight-900">{r.answers.business || r.answers.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {r.answers.name} · {formatDate(r.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={whatsappHref(r.answers.whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-success px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            <MessageCircle aria-hidden className="h-4 w-4" /> WhatsApp
          </a>
          <CopyBrief text={proposalBrief(r.answers, r.notes)} />
        </div>
      </div>

      <form action={updateStatus} className="mt-6 flex flex-wrap gap-2">
        <input type="hidden" name="id" value={r.id} />
        {(Object.keys(statuses) as RequirementStatus[]).map((s) => (
          <button
            key={s}
            name="status"
            value={s}
            aria-pressed={r.status === s}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${r.status === s ? statusStyles[s] : "border border-line bg-white text-slate-600 hover:border-slate-400"}`}
          >
            {statuses[s]}
          </button>
        ))}
      </form>

      <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white px-5">
        {requirementRows(r.answers).map(([k, v]) => (
          <div key={k} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-semibold text-slate-500">{k}</dt>
            <dd className="mt-1 whitespace-pre-wrap break-words text-midnight-900 sm:col-span-2 sm:mt-0">{v}</dd>
          </div>
        ))}
      </dl>

      <form action={updateNotes} className="mt-6 rounded-2xl border border-line bg-white p-5">
        <input type="hidden" name="id" value={r.id} />
        <label htmlFor="notes" className="block text-sm font-semibold text-midnight-900">
          Your private notes
        </label>
        <textarea
          key={r.notes}
          id="notes"
          name="notes"
          rows={5}
          defaultValue={r.notes}
          placeholder="What you learned on the call. These are included in the proposal brief."
          className="mt-1.5 block w-full resize-y rounded-lg border border-line px-3.5 py-2.5 focus:outline-none focus-visible:border-accent-strong focus-visible:ring-2 focus-visible:ring-accent-strong/25"
        />
        <button className="mt-3 rounded-full bg-midnight-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong">Save notes</button>
      </form>

      <div className="mt-8">
        <DeleteButton id={r.id} />
      </div>
    </>
  );
}

export default function RequirementPage({ searchParams }: PageProps<"/admin/view">) {
  return (
    <Suspense fallback={<p className="text-slate-500">Loading…</p>}>
      <Detail searchParams={searchParams} />
    </Suspense>
  );
}
