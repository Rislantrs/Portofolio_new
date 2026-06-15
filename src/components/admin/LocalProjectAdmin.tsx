"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Edit3, Eye, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { projects, type ProjectArticle } from "@/lib/projects";

type EditableProject = Pick<
  ProjectArticle,
  | "id"
  | "slug"
  | "title"
  | "shortTitle"
  | "year"
  | "description"
  | "category"
  | "tags"
  | "image"
  | "github"
  | "demo"
  | "role"
  | "status"
  | "summary"
>;

const storageKey = "rislan-portfolio-local-project-admin";

function toEditableProject(project: ProjectArticle): EditableProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    shortTitle: project.shortTitle,
    year: project.year,
    description: project.description,
    category: project.category,
    tags: project.tags,
    image: project.image,
    github: project.github,
    demo: project.demo,
    role: project.role,
    status: project.status,
    summary: project.summary,
  };
}

const seedProjects = projects.map(toEditableProject);

function emptyProject(nextId: number): EditableProject {
  return {
    id: nextId,
    slug: "new-project",
    title: "New Project Article",
    shortTitle: "New",
    year: "2026",
    description: "Short project description.",
    category: "Web Development",
    tags: ["Next.js"],
    image: "/assets/IMG_0304.JPG",
    role: "Project owner",
    status: "draft",
    summary: "A concise article summary for the project detail page.",
  };
}

function readStoredProjects() {
  if (typeof window === "undefined") return seedProjects;

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return seedProjects;
    const parsed = JSON.parse(stored) as EditableProject[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedProjects;
  } catch {
    return seedProjects;
  }
}

function normalizeTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function LocalProjectAdmin() {
  const [items, setItems] = useState<EditableProject[]>(seedProjects);
  const [selectedId, setSelectedId] = useState(seedProjects[0]?.id ?? 1);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    setItems(readStoredProjects());
  }, []);

  const selectedProject = useMemo(
    () => items.find((item) => item.id === selectedId) || items[0],
    [items, selectedId]
  );

  useEffect(() => {
    if (!selectedProject && items[0]) setSelectedId(items[0].id);
  }, [items, selectedProject]);

  function updateProject(patch: Partial<EditableProject>) {
    if (!selectedProject) return;

    setItems((current) =>
      current.map((item) =>
        item.id === selectedProject.id
          ? {
              ...item,
              ...patch,
            }
          : item
      )
    );
  }

  function saveProjects() {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
    setSavedAt(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
  }

  function addProject() {
    const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
    const project = emptyProject(nextId);
    setItems((current) => [project, ...current]);
    setSelectedId(project.id);
  }

  function deleteProject() {
    if (!selectedProject) return;

    const confirmed = window.confirm(`Delete "${selectedProject.title}" from local sandbox?`);
    if (!confirmed) return;

    setItems((current) => current.filter((item) => item.id !== selectedProject.id));
  }

  function resetSandbox() {
    const confirmed = window.confirm("Reset local admin sandbox to seed data?");
    if (!confirmed) return;

    window.localStorage.removeItem(storageKey);
    setItems(seedProjects);
    setSelectedId(seedProjects[0]?.id ?? 1);
    setSavedAt(null);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
      <aside className="rounded-lg border border-white/5 bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-white/5 p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
              Articles
            </p>
            <p className="mt-1 font-display text-2xl font-black text-accent-light">{items.length}</p>
          </div>
          <button
            type="button"
            onClick={addProject}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-black transition-colors hover:bg-accent-light"
            aria-label="Add project"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="max-h-[680px] overflow-y-auto p-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`mb-2 w-full rounded-lg border p-3 text-left transition-colors ${
                selectedProject?.id === item.id
                  ? "border-accent/45 bg-accent/10"
                  : "border-white/5 bg-bg-elevated hover:border-white/15"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-display text-sm font-bold text-accent-light">
                  {item.title}
                </p>
                <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-text-subtle">
                  {item.status}
                </span>
              </div>
              <p className="mt-2 truncate font-sans text-xs text-text-muted">{item.slug}</p>
            </button>
          ))}
        </div>
      </aside>

      <section className="rounded-lg border border-white/5 bg-surface p-5 md:p-6">
        {selectedProject ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-4 border-b border-white/5 pb-5 md:flex-row md:items-start">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                  Local free sandbox
                </p>
                <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-accent-light">
                  Project CRUD
                </h2>
                <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-text-muted">
                  Data di halaman ini tersimpan di browser kamu. Untuk production, sambungkan
                  schema Supabase free tier dari dokumen rencana.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/projects/${selectedProject.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-text transition-colors hover:border-accent/40"
                >
                  <Eye size={15} />
                  View
                </Link>
                <button
                  type="button"
                  onClick={saveProjects}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-accent-light"
                >
                  <Save size={15} />
                  Save
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                  Title
                </span>
                <input
                  value={selectedProject.title}
                  onChange={(event) => updateProject({ title: event.target.value })}
                  className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none transition-colors focus:border-accent/50"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                  Slug
                </span>
                <input
                  value={selectedProject.slug}
                  onChange={(event) => updateProject({ slug: event.target.value })}
                  className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none transition-colors focus:border-accent/50"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                  Category
                </span>
                <input
                  value={selectedProject.category}
                  onChange={(event) => updateProject({ category: event.target.value })}
                  className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none transition-colors focus:border-accent/50"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                  Year
                </span>
                <input
                  value={selectedProject.year}
                  onChange={(event) => updateProject({ year: event.target.value })}
                  className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none transition-colors focus:border-accent/50"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                  Status
                </span>
                <select
                  value={selectedProject.status}
                  onChange={(event) =>
                    updateProject({ status: event.target.value as EditableProject["status"] })
                  }
                  className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none transition-colors focus:border-accent/50"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                  Tags
                </span>
                <input
                  value={selectedProject.tags.join(", ")}
                  onChange={(event) => updateProject({ tags: normalizeTags(event.target.value) })}
                  className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none transition-colors focus:border-accent/50"
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                  Summary
                </span>
                <textarea
                  value={selectedProject.summary}
                  onChange={(event) => updateProject({ summary: event.target.value })}
                  rows={3}
                  className="resize-none rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm leading-relaxed text-text outline-none transition-colors focus:border-accent/50"
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                  Description
                </span>
                <textarea
                  value={selectedProject.description}
                  onChange={(event) => updateProject({ description: event.target.value })}
                  rows={4}
                  className="resize-none rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm leading-relaxed text-text outline-none transition-colors focus:border-accent/50"
                />
              </label>
            </div>

            <div className="rounded-lg border border-accent/15 bg-accent/5 p-4">
              <div className="flex items-center gap-2 font-display text-sm font-bold text-accent-light">
                <Edit3 size={16} />
                Notion-like editor next
              </div>
              <p className="mt-2 font-sans text-xs leading-relaxed text-text-muted">
                Tahap berikutnya: block editor untuk heading, paragraph, image, gallery, code,
                link button, dan kontrol posisi gambar kiri/tengah/kanan/wide. Format block-nya
                sudah disiapkan di data artikel public.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-5">
              <div className="font-sans text-xs text-text-subtle">
                {savedAt ? `Saved locally at ${savedAt}` : "Not saved in this session yet"}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={resetSandbox}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-text transition-colors hover:border-white/25"
                >
                  <RotateCcw size={15} />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={deleteProject}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-red-200 transition-colors hover:border-red-300/45"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="font-sans text-sm text-text-muted">No project selected.</p>
        )}
      </section>
    </div>
  );
}
