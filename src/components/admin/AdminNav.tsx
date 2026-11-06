import Link from "next/link";
import { connection } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

const linkCls = "rounded-full px-3 py-1.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white";

export async function AdminNav() {
  await connection();
  if (!(await isAdmin())) return null;
  return (
    <nav aria-label="Admin" className="flex flex-wrap items-center gap-1">
      <Link href="/admin" className={linkCls}>
        Requirements
      </Link>
      <Link href="/admin/videos" className={linkCls}>
        Video Portfolio Management
      </Link>
    </nav>
  );
}
