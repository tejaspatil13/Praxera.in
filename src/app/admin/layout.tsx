import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/layout/Wordmark";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div data-bare className="min-h-dvh bg-mist">
      <div className="on-dark bg-midnight-900">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
          <Link href="/admin" aria-label="Admin home">
            <Wordmark tone="dark" />
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
