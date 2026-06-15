import Link from "next/link";
import ClientOnlyCustomCursor from "@/components/ClientOnlyCustomCursor";

export const metadata = {
  title: "Admin",
  description: "Free-first admin foundation for project article management.",
};

export default function AdminPage() {
  return (
    <>
      <ClientOnlyCustomCursor />
      <main className="min-h-screen bg-bg px-6 py-8 text-text md:px-12 lg:px-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <header className="flex flex-col gap-5 border-b border-white/5 pb-8">
            <Link
              href="/"
              className="w-fit font-display text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:text-accent-light"
            >
              Back to portfolio
            </Link>
            <div className="max-w-4xl">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-accent">
                Free-first admin
              </p>
              <h1 className="mt-3 font-display text-5xl font-black leading-none tracking-tighter md:text-7xl">
                Project <span className="text-accent-light italic">Control</span>
              </h1>
              <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-text-muted md:text-base">
                Admin foundation untuk mengatur article project. Mode awal dibuat gratis:
                public article memakai data lokal, sedangkan CRUD sandbox disimpan di browser.
              </p>
            </div>
          </header>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              href="/admin/projects"
              className="rounded-lg border border-accent/20 bg-accent/10 p-5 transition-colors hover:border-accent/45"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                CRUD
              </p>
              <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-accent-light">
                Project Articles
              </h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-text-muted">
                Create, edit, publish, reset, dan delete di sandbox lokal.
              </p>
            </Link>

            <div className="rounded-lg border border-white/5 bg-surface p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                Security
              </p>
              <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-accent-light">
                Locked Later
              </h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-text-muted">
                Production admin harus pakai Supabase Auth free tier, MFA, RLS, dan IP allowlist.
              </p>
            </div>

            <div className="rounded-lg border border-white/5 bg-surface p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                Images
              </p>
              <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-accent-light">
                WebP Pipeline
              </h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-text-muted">
                Upload dan kompresi WebP masuk fase berikutnya setelah storage dipilih.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
