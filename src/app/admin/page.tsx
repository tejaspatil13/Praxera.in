import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { ChevronRight, LogOut } from "lucide-react";
import { logout } from "./actions";
import { LoginForm } from "@/components/admin/AdminControls";
import { AdminNotice, formatDate, statusStyles } from "@/components/admin/AdminNotice";
import { adminConfigured, isAdmin } from "@/lib/adminAuth";
import { dbConfigured, listRequirements } from "@/lib/db";
import { statuses, type RequirementStatus } from "@/lib/requirements";

async function Dashboard() {
  // Environment variables are read at request time, not frozen into the build.
  await connection();
  if (!adminConfigured()) {
    return (
      <AdminNotice title="Set your admin password">
        Add an environment variable called ADMIN_PASSWORD in Vercel, then redeploy. Sign-in stays switched off until then.
      </AdminNotice>
    );
  }
  if (!(await isAdmin())) return <LoginForm />;
  if (!dbConfigured()) {
    return (
      <AdminNotice title="Connect the database">
        In Vercel, open this project’s Storage tab, create a Neon Postgres database and connect it, then redeploy. Until then, new
        requirements still reach hello@praxera.in by email.
      </AdminNotice>
    );
  }

  const items = await listRequirements();
  const count = (s: RequirementStatus) => items.filter((r) => r.status === s).length;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-midnight-900">Requirements</h1>
        <form action={logout}>
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-midnight-900">
            <LogOut aria-hidden className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(Object.keys(statuses) as RequirementStatus[]).map((s) => (
          <div key={s} className="rounded-2xl border border-line bg-white p-4">
            <dd className="font-display text-2xl font-bold text-midnight-900">{count(s)}</dd>
            <dt className="text-sm text-slate-500">{statuses[s]}</dt>
          </div>
        ))}
      </dl>

      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-line bg-white p-8 text-center text-slate-600">
          Nothing yet. Send clients to <span className="font-semibold">praxera.in/requirements</span> and their answers will appear here.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/view?id=${r.id}`} className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card transition-colors hover:border-accent-strong sm:p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-midnight-900">{r.answers.business || r.answers.name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[r.status]}`}>{statuses[r.status]}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-600">{r.answers.problem}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {r.answers.name} · {r.answers.budget} · {formatDate(r.createdAt)}
                  </p>
                </div>
                <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Loading…</p>}>
      <Dashboard />
    </Suspense>
  );
}
