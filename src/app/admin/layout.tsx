import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { Wordmark } from "@/components/layout/Wordmark";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div data-bare className="min-h-dvh bg-mist">
      <div className="on-dark bg-midnight-900">
        <div className="mx-auto flex min-h-16 max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2">
          <Link href="/admin" aria-label="Admin home">
            <Wordmark tone="dark" />
          </Link>
          <Suspense>
            <AdminNav />
          </Suspense>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
