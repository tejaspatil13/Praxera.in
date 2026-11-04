/** Explains a missing setup step on the admin page, in place of the data it would show. */
export function AdminNotice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto mt-16 max-w-lg rounded-3xl border border-line bg-white p-8 shadow-card">
      <h1 className="font-display text-2xl font-bold text-midnight-900">{title}</h1>
      <p className="mt-3 leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}

export const statusStyles = {
  new: "bg-accent-soft text-accent-deep",
  contacted: "bg-midnight-800 text-white",
  proposal: "bg-warn-soft text-warn",
  won: "bg-success text-white",
  lost: "bg-slate-300 text-midnight-800",
} as const;

export const formatDate = (d: Date) =>
  d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
