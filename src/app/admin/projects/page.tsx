import Link from "next/link";
import ClientOnlyCustomCursor from "@/components/ClientOnlyCustomCursor";
import LocalProjectAdmin from "@/components/admin/LocalProjectAdmin";

export const metadata = {
  title: "Admin Projects",
  description: "Local free CRUD sandbox for project articles.",
};

export default function AdminProjectsPage() {
  return (
    <>
      <ClientOnlyCustomCursor />
      <main className="min-h-screen bg-bg px-6 py-8 text-text md:px-12 lg:px-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <header className="flex flex-col justify-between gap-5 border-b border-white/5 pb-8 lg:flex-row lg:items-end">
            <div>
              <Link
                href="/admin"
                className="font-display text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:text-accent-light"
              >
                Back to admin
              </Link>
              <h1 className="mt-4 font-display text-5xl font-black leading-none tracking-tighter md:text-7xl">
                Article <span className="text-accent-light italic">Manager</span>
              </h1>
              <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-text-muted md:text-base">
                CRUD sandbox gratis untuk mematangkan alur admin sebelum data dipindahkan ke
                Supabase free tier.
              </p>
            </div>
            <Link
              href="/projects"
              className="w-fit rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-text transition-colors hover:border-accent/40"
            >
              Public articles
            </Link>
          </header>

          <div className="rounded-lg border border-white/15 bg-white/5 p-4">
            <p className="font-sans text-sm leading-relaxed text-text-muted">
              Mode ini gratis dan lokal: data tersimpan di browser, bukan database production.
              Jangan jadikan ini panel admin final sebelum auth, RLS, MFA, dan storage aman aktif.
            </p>
          </div>

          <LocalProjectAdmin />
        </div>
      </main>
    </>
  );
}
