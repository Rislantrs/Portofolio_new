import Link from "next/link";
import { ArrowRight, Database, FileText, ImageIcon, ShieldCheck } from "lucide-react";
import ClientOnlyCustomCursor from "@/components/ClientOnlyCustomCursor";

export const metadata = {
  title: "Admin",
  description: "Admin command center for portfolio content management.",
};

const adminCards = [
  {
    href: "/admin/projects",
    icon: FileText,
    label: "Content",
    title: "Project Articles",
    description: "Kelola artikel project, status publish, cover image, tags, dan block konten.",
    cta: "Open manager",
    active: true,
  },
  {
    icon: ShieldCheck,
    label: "Access",
    title: "Security Layer",
    description: "Auth, RLS, MFA, dan policy production disiapkan sebagai guardrail berikutnya.",
    cta: "Planned",
  },
  {
    icon: ImageIcon,
    label: "Assets",
    title: "WebP Pipeline",
    description: "Upload image dikompresi ke WebP sebelum masuk ke Supabase Storage.",
    cta: "Ready in editor",
  },
];

export default function AdminPage() {
  return (
    <>
      <ClientOnlyCustomCursor />
      <main id="admin" className="min-h-screen bg-bg text-text">
        <div className="admin-shell py-8 md:py-10">
          <header className="admin-hero">
            <div className="flex flex-col gap-5">
              <Link href="/" className="admin-backlink">
                Back to portfolio
              </Link>
              <div className="max-w-4xl">
                <p className="admin-kicker">Portfolio CMS</p>
                <h1 className="admin-title">
                  Admin <span>Command</span>
                </h1>
                <p className="admin-lede">
                  Panel ini dibuat untuk kerja cepat: pilih modul, edit konten, simpan ke Supabase,
                  lalu cek output public tanpa bolak-balik struktur file.
                </p>
              </div>
            </div>

            <div className="admin-status-panel">
              <div>
                <p className="admin-kicker">Environment</p>
                <p className="mt-2 text-xl font-black text-white">Production Content</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wide text-text-muted">
                <span className="admin-pill">Supabase</span>
                <span className="admin-pill">WebP</span>
                <span className="admin-pill">Drafts</span>
                <span className="admin-pill">Preview</span>
              </div>
            </div>
          </header>

          <section className="grid gap-4 lg:grid-cols-3">
            {adminCards.map((card) => {
              const Icon = card.icon;
              const content = (
                <article className={`admin-nav-card ${card.active ? "admin-nav-card-active" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="admin-icon-box">
                      <Icon size={19} />
                    </div>
                    <span className="admin-kicker">{card.label}</span>
                  </div>
                  <div className="mt-8">
                    <h2 className="text-2xl font-black tracking-tight text-white">{card.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-text-muted">{card.description}</p>
                  </div>
                  <div className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-accent-light">
                    {card.cta}
                    {card.href ? <ArrowRight size={14} /> : null}
                  </div>
                </article>
              );

              return card.href ? (
                <Link key={card.title} href={card.href}>
                  {content}
                </Link>
              ) : (
                <div key={card.title}>{content}</div>
              );
            })}
          </section>

          <section className="admin-info-strip">
            <Database size={18} />
            <p>
              Data editor terhubung ke Supabase jika env tersedia. Kalau env belum aktif, beberapa aksi save/upload akan memberi feedback error tanpa merusak tampilan public.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}