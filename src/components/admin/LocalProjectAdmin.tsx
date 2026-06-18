"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Plus, Save, Trash2, Upload, FileText, Award, Loader2, Trash } from "lucide-react";
import { type ProjectArticle, type ProjectContentBlock } from "@/lib/projects";
import { type Certificate } from "@/lib/certifications";
import {
  fetchProjects,
  saveProject,
  deleteProject as dbDeleteProject,
  fetchCertifications,
  saveCertification,
  deleteCertification as dbDeleteCertification,
} from "@/lib/supabaseDb";
import { supabase } from "@/lib/supabase";


function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function createProjectContentBlock(type: "paragraph" | "heading", index: number): ProjectContentBlock {
  return type === "heading"
    ? { id: `block_${index}`, type: "heading", level: 2, text: "New Section Heading" }
    : { id: `block_${index}`, type: "paragraph", text: "New paragraph content..." };
}

function getTextContent(block: ProjectContentBlock) {
  return block.type === "paragraph" || block.type === "heading" ? block.text : "";
}
// Helper to compress and convert file to WebP client-side using HTML5 Canvas
async function compressAndConvertToWebP(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create WebP blob"));
        },
        "image/webp",
        quality
      );
    };
    img.onerror = (err) => reject(err);
  });
}

export default function LocalProjectAdmin() {
  const [activeTab, setActiveTab] = useState<"projects" | "certifications">("projects");

  // Projects State
  const [projectsList, setProjectsList] = useState<ProjectArticle[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // Certifications State
  const [certsList, setCertsList] = useState<Certificate[]>([]);
  const [selectedCertId, setSelectedCertId] = useState<number | null>(null);

  // Status & UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Load Data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const pData = await fetchProjects();
      const cData = await fetchCertifications();
      setProjectsList(pData);
      setCertsList(cData);
      if (pData.length > 0) setSelectedProjectId(pData[0].id);
      if (cData.length > 0) setSelectedCertId(cData[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void loadAllData(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Selected Items
  const selectedProject = projectsList.find((p) => p.id === selectedProjectId) || projectsList[0];
  const selectedCert = certsList.find((c) => c.id === selectedCertId) || certsList[0];

  // Helper: show transient feedback messages
  const showFeedback = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // Image Upload Handler
  const handleImageUpload = async (file: File, type: "project" | "certification") => {
    const isSupabaseConfigured =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!isSupabaseConfigured) {
      showFeedback("Supabase is not configured. Upload disabled.", "error");
      return;
    }

    setUploading(true);
    try {
      // 1. Compress client-side
      const webpBlob = await compressAndConvertToWebP(file);

      // 2. Upload to Storage
      const safeBaseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
      const fileName = `${file.lastModified}_${safeBaseName}.webp`;
      const folder = type === "project" ? "projects" : "certifications";
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from("portfolio")
        .upload(filePath, webpBlob, {
          contentType: "image/webp",
          upsert: true,
        });

      if (error) throw error;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      // 4. Update state
      if (type === "project" && selectedProject) {
        updateProject({ image: publicUrl });
        showFeedback("Project image compressed to WebP and uploaded!", "success");
      } else if (type === "certification" && selectedCert) {
        updateCert({ badgeIcon: publicUrl });
        showFeedback("Certificate badge compressed to WebP and uploaded!", "success");
      }
    } catch (err: unknown) {
      console.error(err);
      showFeedback(`Upload failed: ${getErrorMessage(err)}`, "error");
    } finally {
      setUploading(false);
    }
  };

  // CRUD Projects
  const updateProject = (patch: Partial<ProjectArticle>) => {
    if (!selectedProject) return;
    setProjectsList((prev) =>
      prev.map((item) => (item.id === selectedProject.id ? { ...item, ...patch } : item))
    );
  };

  const handleSaveProject = async () => {
    if (!selectedProject) return;
    setSaving(true);
    try {
      const res = await saveProject(selectedProject);
      if (res.success) {
        showFeedback("Project successfully saved to Supabase!", "success");
        const pData = await fetchProjects();
        setProjectsList(pData);
        if (res.data) setSelectedProjectId(res.data.id);
      } else {
        throw new Error(res.error);
      }
    } catch (err: unknown) {
      showFeedback(`Save failed: ${getErrorMessage(err)}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = () => {
    const nextId = -(Math.max(0, ...projectsList.map((p) => Math.abs(p.id))) + 1); // temp negative ID for insert
    const newProj: ProjectArticle = {
      id: nextId,
      slug: `new-project-${Math.abs(nextId)}`,
      title: "New Project Article",
      shortTitle: "New Proj",
      year: new Date().getFullYear().toString(),
      description: "Detailed description of the project.",
      category: "Web Development",
      tags: ["React", "Next.js"],
      image: "/assets/IMG_0304_compressed.webp",
      role: "Developer",
      status: "draft",
      summary: "Concise summary for previews.",
      content: [
        { id: "intro", type: "paragraph", text: "Write your project introduction here..." }
      ],
    };
    setProjectsList((prev) => [newProj, ...prev]);
    setSelectedProjectId(newProj.id);
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    const confirm = window.confirm(`Are you sure you want to delete "${selectedProject.title}"?`);
    if (!confirm) return;

    if (selectedProject.id < 0) {
      setProjectsList((prev) => prev.filter((p) => p.id !== selectedProject.id));
      const remaining = projectsList.filter((p) => p.id !== selectedProject.id);
      if (remaining.length > 0) setSelectedProjectId(remaining[0].id);
      else setSelectedProjectId(null);
      showFeedback("Temp project discarded.", "success");
      return;
    }

    setSaving(true);
    try {
      const res = await dbDeleteProject(selectedProject.id);
      if (res.success) {
        showFeedback("Project deleted from database.", "success");
        const pData = await fetchProjects();
        setProjectsList(pData);
        setSelectedProjectId(pData[0]?.id || null);
      } else {
        throw new Error(res.error);
      }
    } catch (err: unknown) {
      showFeedback(`Delete failed: ${getErrorMessage(err)}`, "error");
    } finally {
      setSaving(false);
    }
  };

  // CRUD Certifications
  const updateCert = (patch: Partial<Certificate>) => {
    if (!selectedCert) return;
    setCertsList((prev) =>
      prev.map((item) => (item.id === selectedCert.id ? { ...item, ...patch } : item))
    );
  };

  const handleSaveCert = async () => {
    if (!selectedCert) return;
    setSaving(true);
    try {
      const res = await saveCertification(selectedCert);
      if (res.success) {
        showFeedback("Certification successfully saved to Supabase!", "success");
        const cData = await fetchCertifications();
        setCertsList(cData);
        if (res.data) setSelectedCertId(res.data.id);
      } else {
        throw new Error(res.error);
      }
    } catch (err: unknown) {
      showFeedback(`Save failed: ${getErrorMessage(err)}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCert = () => {
    const nextId = -(Math.max(0, ...certsList.map((c) => Math.abs(c.id))) + 1);
    const newCert: Certificate = {
      id: nextId,
      name: "New Certification Name",
      organizer: "Google / Microsoft",
      year: new Date().getFullYear().toString(),
      category: "web",
      badgeName: "New Badge",
      badgeIcon: "/assets/Gemini_compressed.webp",
    };
    setCertsList((prev) => [newCert, ...prev]);
    setSelectedCertId(newCert.id);
  };

  const handleDeleteCert = async () => {
    if (!selectedCert) return;
    const confirm = window.confirm(`Are you sure you want to delete "${selectedCert.name}"?`);
    if (!confirm) return;

    if (selectedCert.id < 0) {
      setCertsList((prev) => prev.filter((c) => c.id !== selectedCert.id));
      const remaining = certsList.filter((c) => c.id !== selectedCert.id);
      if (remaining.length > 0) setSelectedCertId(remaining[0].id);
      else setSelectedCertId(null);
      showFeedback("Temp certification discarded.", "success");
      return;
    }

    setSaving(true);
    try {
      const res = await dbDeleteCertification(selectedCert.id);
      if (res.success) {
        showFeedback("Certification deleted from database.", "success");
        const cData = await fetchCertifications();
        setCertsList(cData);
        setSelectedCertId(cData[0]?.id || null);
      } else {
        throw new Error(res.error);
      }
    } catch (err: unknown) {
      showFeedback(`Delete failed: ${getErrorMessage(err)}`, "error");
    } finally {
      setSaving(false);
    }
  };

  // --- Content Block Editor Helpers ---
  const updateContentBlock = (blockId: string, text: string) => {
    if (!selectedProject) return;
    const updatedContent = selectedProject.content.map((b) =>
      b.id === blockId ? { ...b, text } : b
    );
    updateProject({ content: updatedContent });
  };

  const deleteContentBlock = (blockId: string) => {
    if (!selectedProject) return;
    const updatedContent = selectedProject.content.filter((b) => b.id !== blockId);
    updateProject({ content: updatedContent });
  };

  const addContentBlock = (type: "paragraph" | "heading") => {
    if (!selectedProject) return;
    const newBlock = createProjectContentBlock(type, selectedProject.content.length + 1);
    updateProject({ content: [...selectedProject.content, newBlock] });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center gap-3 text-text-muted">
        <Loader2 className="animate-spin text-accent" size={24} />
        <span>Loading from Supabase...</span>
      </div>
    );
  }

  return (
    <div className="admin-workbench flex flex-col gap-6">
      {/* Toast Feedback Message */}
      {message && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 shadow-xl backdrop-blur-md animate-fade-in ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          <span>{message.text}</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="admin-tabs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "projects"
              ? "border-accent text-accent-light"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <FileText size={16} />
          Projects ({projectsList.length})
        </button>
        <button
          onClick={() => setActiveTab("certifications")}
          className={`flex items-center gap-2 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "certifications"
              ? "border-accent text-accent-light"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          <Award size={16} />
          Certifications ({certsList.length})
        </button>
      </div>

      {activeTab === "projects" ? (
        // --- PROJECTS TAB ---
        <div className="admin-editor-grid grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-white/5 bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-white/5 p-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                  Project Articles
                </p>
                <p className="mt-1 font-display text-2xl font-black text-accent-light">{projectsList.length}</p>
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-black transition-colors hover:bg-accent-light"
                aria-label="Add project"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="max-h-[680px] overflow-y-auto p-2">
              {projectsList.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedProjectId(item.id)}
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
                      Supabase Cloud Storage
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-accent-light">
                      Project Editor
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/projects/${selectedProject.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-text transition-colors hover:border-accent/40"
                    >
                      <Eye size={15} />
                      View Detail
                    </Link>
                    <button
                      type="button"
                      onClick={handleSaveProject}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-accent-light disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
                      Save to Supabase
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Title</span>
                    <input
                      value={selectedProject.title}
                      onChange={(e) => updateProject({ title: e.target.value })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Slug</span>
                    <input
                      value={selectedProject.slug}
                      onChange={(e) => updateProject({ slug: e.target.value })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Category</span>
                    <input
                      value={selectedProject.category}
                      onChange={(e) => updateProject({ category: e.target.value })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Year</span>
                    <input
                      value={selectedProject.year}
                      onChange={(e) => updateProject({ year: e.target.value })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Role</span>
                    <input
                      value={selectedProject.role}
                      onChange={(e) => updateProject({ role: e.target.value })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Status</span>
                    <select
                      value={selectedProject.status}
                      onChange={(e) => updateProject({ status: e.target.value as ProjectArticle["status"] })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Tags (comma separated)</span>
                    <input
                      value={selectedProject.tags.join(", ")}
                      onChange={(e) => updateProject({ tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  {/* Project Image WebP Upload Pipeline */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Project Image</span>
                    <div className="flex flex-col gap-3 rounded-lg border border-white/5 bg-bg-elevated p-4 md:flex-row md:items-center">
                      <div className="relative aspect-[4/3] w-28 overflow-hidden rounded border border-white/10 bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element -- Admin previews support arbitrary stored image URLs. */}
                        <img
                          src={selectedProject.image}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-text-muted truncate max-w-md font-mono">URL: {selectedProject.image}</p>
                        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 font-display text-[10px] font-bold uppercase tracking-wider text-text transition-colors hover:bg-white/10">
                          {uploading ? <Loader2 className="animate-spin" size={12} /> : <Upload size={12} />}
                          {uploading ? "Compressing & Uploading..." : "Choose Photo (Auto-WebP)"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "project");
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Github URL</span>
                    <input
                      value={selectedProject.github || ""}
                      onChange={(e) => updateProject({ github: e.target.value })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Demo URL</span>
                    <input
                      value={selectedProject.demo || ""}
                      onChange={(e) => updateProject({ demo: e.target.value })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Summary</span>
                    <textarea
                      value={selectedProject.summary}
                      onChange={(e) => updateProject({ summary: e.target.value })}
                      rows={2}
                      className="resize-none rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm leading-relaxed text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Description</span>
                    <textarea
                      value={selectedProject.description}
                      onChange={(e) => updateProject({ description: e.target.value })}
                      rows={3}
                      className="resize-none rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm leading-relaxed text-text outline-none focus:border-accent/50"
                    />
                  </label>
                </div>

                {/* Structured Content Block Editor */}
                <div className="flex flex-col gap-4 border-t border-white/5 pt-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display text-lg font-bold text-accent-light">Article Content Blocks</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addContentBlock("paragraph")}
                        className="flex items-center gap-1 rounded bg-white/5 border border-white/10 px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-wider text-text transition-colors hover:bg-white/10"
                      >
                        <Plus size={10} /> Add Paragraph
                      </button>
                      <button
                        onClick={() => addContentBlock("heading")}
                        className="flex items-center gap-1 rounded bg-white/5 border border-white/10 px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-wider text-text transition-colors hover:bg-white/10"
                      >
                        <Plus size={10} /> Add Heading
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {selectedProject.content.map((block, index) => (
                      <div key={block.id || index} className="flex gap-3 rounded-lg border border-white/5 bg-bg-elevated/40 p-4">
                        <div className="flex flex-col justify-between items-center text-text-subtle font-mono text-[10px]">
                          <span>#{index + 1}</span>
                          <span className="uppercase font-bold text-accent">{block.type}</span>
                        </div>
                        <div className="flex-1">
                          {(block.type === "paragraph" || block.type === "heading") ? (
                            <textarea
                              value={getTextContent(block)}
                              onChange={(e) => updateContentBlock(block.id, e.target.value)}
                              rows={block.type === "heading" ? 1 : 3}
                              className="w-full resize-none rounded border border-white/10 bg-bg px-3 py-2 font-sans text-sm text-text outline-none focus:border-accent/40"
                              placeholder={`Enter ${block.type} content...`}
                            />
                          ) : (
                            <p className="text-xs text-text-muted italic">Block type &quot;{block.type}&quot; is managed by raw fields or assets.</p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteContentBlock(block.id)}
                          className="text-red-400 hover:text-red-300 p-2 flex items-center justify-center"
                          title="Delete Block"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-5">
                  <button
                    type="button"
                    onClick={handleDeleteProject}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-red-200 transition-colors hover:border-red-300/45 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    Delete Project
                  </button>
                </div>
              </div>
            ) : (
              <p className="font-sans text-sm text-text-muted">No project selected.</p>
            )}
          </section>
        </div>
      ) : (
        // --- CERTIFICATIONS TAB ---
        <div className="admin-editor-grid grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-white/5 bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-white/5 p-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                  Certifications
                </p>
                <p className="mt-1 font-display text-2xl font-black text-accent-light">{certsList.length}</p>
              </div>
              <button
                type="button"
                onClick={handleAddCert}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-black transition-colors hover:bg-accent-light"
                aria-label="Add certificate"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="max-h-[680px] overflow-y-auto p-2">
              {certsList.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCertId(item.id)}
                  className={`mb-2 w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedCert?.id === item.id
                      ? "border-accent/45 bg-accent/10"
                      : "border-white/5 bg-bg-elevated hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-display text-sm font-bold text-accent-light">
                      {item.name}
                    </p>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-text-subtle">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-2 truncate font-sans text-xs text-text-muted">{item.organizer}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-lg border border-white/5 bg-surface p-5 md:p-6">
            {selectedCert ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col justify-between gap-4 border-b border-white/5 pb-5 md:flex-row md:items-start">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                      Supabase Cloud Storage
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-accent-light">
                      Certificate Editor
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveCert}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-accent-light disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
                    Save to Supabase
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Certificate Name</span>
                    <input
                      value={selectedCert.name}
                      onChange={(e) => updateCert({ name: e.target.value })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Organizer</span>
                    <input
                      value={selectedCert.organizer}
                      onChange={(e) => updateCert({ organizer: e.target.value })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Year</span>
                    <input
                      value={selectedCert.year}
                      onChange={(e) => updateCert({ year: e.target.value })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Category</span>
                    <select
                      value={selectedCert.category}
                      onChange={(e) => updateCert({ category: e.target.value as Certificate["category"] })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    >
                      <option value="ai">AI / Machine Learning</option>
                      <option value="cloud">Cloud Computing</option>
                      <option value="network">Networking</option>
                      <option value="web">Web Development</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Badge Display Name</span>
                    <input
                      value={selectedCert.badgeName}
                      onChange={(e) => updateCert({ badgeName: e.target.value })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Credential URL (Optional)</span>
                    <input
                      value={selectedCert.link || ""}
                      onChange={(e) => updateCert({ link: e.target.value || undefined })}
                      className="rounded-lg border border-white/10 bg-bg-elevated px-4 py-3 font-sans text-sm text-text outline-none focus:border-accent/50"
                      placeholder="e.g. https://credly.com/..."
                    />
                  </label>

                  {/* Badge Image WebP Upload Pipeline */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">Badge Icon / Logo</span>
                    <div className="flex flex-col gap-3 rounded-lg border border-white/5 bg-bg-elevated p-4 md:flex-row md:items-center">
                      <div className="relative aspect-square w-16 overflow-hidden rounded border border-white/10 bg-black flex items-center justify-center p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element -- Admin previews support arbitrary stored image URLs. */}
                        <img
                          src={selectedCert.badgeIcon}
                          alt="Badge Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-text-muted truncate max-w-md font-mono">URL: {selectedCert.badgeIcon}</p>
                        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 font-display text-[10px] font-bold uppercase tracking-wider text-text transition-colors hover:bg-white/10">
                          {uploading ? <Loader2 className="animate-spin" size={12} /> : <Upload size={12} />}
                          {uploading ? "Compressing & Uploading..." : "Choose Logo (Auto-WebP)"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "certification");
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-5">
                  <button
                    type="button"
                    onClick={handleDeleteCert}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-red-200 transition-colors hover:border-red-300/45 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    Delete Certification
                  </button>
                </div>
              </div>
            ) : (
              <p className="font-sans text-sm text-text-muted">No certification selected.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
