import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ClientOnlyCustomCursor from "@/components/ClientOnlyCustomCursor";
import LocalProjectAdmin from "@/components/admin/LocalProjectAdmin";

export const metadata = {
  title: "Admin Projects",
  description: "Content manager for project articles and certifications.",
};

export default function AdminProjectsPage() {
  return (
    <>
      <ClientOnlyCustomCursor />
      <main id="admin" className="min-h-screen bg-bg text-text">
        <div className="admin-shell py-8 md:py-10">
          <header className="admin-page-header">
            <div className="min-w-0">
              <Link href="/admin" className="admin-backlink inline-flex items-center gap-2">
                <ArrowLeft size={14} />
                Back to admin
              </Link>
              <p className="admin-kicker mt-7">Content manager</p>
              <h1 className="admin-title admin-title-compact">
                Article <span>Manager</span>
              </h1>
              <p className="admin-lede">
                Edit project articles dan certifications dari satu workbench yang lebih rapi: list di kiri, form utama di kanan, aksi penting selalu terlihat.
              </p>
            </div>

            <Link href="/projects" className="admin-secondary-action">
              Public articles
              <ExternalLink size={15} />
            </Link>
          </header>

          <div className="admin-alert">
            <strong>Catatan:</strong> Upload dan save memakai Supabase saat konfigurasi env tersedia. Perubahan draft sementara tetap aman di state editor sampai kamu simpan.
          </div>

          <LocalProjectAdmin />
        </div>
      </main>
    </>
  );
}