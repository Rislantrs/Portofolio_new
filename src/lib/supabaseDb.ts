import { type ProjectArticle } from "./projects";
import { type Certificate } from "./certifications";

type MutationResult<T> = { success: boolean; data?: T; error?: string };

// Client-side helper functions yang melakukan fetch ke Next.js API Routes.
// Digunakan oleh Client Components dan membebaskan bundle browser dari beban Mongoose.

export async function fetchProjects(): Promise<ProjectArticle[]> {
  try {
    const res = await fetch("/api/admin/projects");
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to fetch projects");
    }
    const data = await res.json();
    return data.projects;
  } catch (error) {
    console.error("Error in fetchProjects client:", error);
    throw error;
  }
}

export async function fetchPublishedProjects(): Promise<ProjectArticle[]> {
  try {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Failed to fetch published projects");
    const data = await res.json();
    return data.projects;
  } catch (error) {
    console.error("Error in fetchPublishedProjects client:", error);
    throw error;
  }
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectArticle | null> {
  try {
    const published = await fetchPublishedProjects();
    return published.find((p) => p.slug === slug) || null;
  } catch (error) {
    console.error(`Error in fetchProjectBySlug client for ${slug}:`, error);
    return null;
  }
}

export async function fetchRelatedProjects(slug: string, limit = 3): Promise<ProjectArticle[]> {
  try {
    const published = await fetchPublishedProjects();
    const current = published.find((p) => p.slug === slug);
    if (!current) return published.filter((p) => p.slug !== slug).slice(0, limit);

    return published
      .filter((p) => p.slug !== slug)
      .map((p) => ({
        project: p,
        score:
          p.tags.filter((tag) => current.tags.includes(tag)).length +
          (p.category === current.category ? 2 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .map(({ project }) => project)
      .slice(0, limit);
  } catch (error) {
    console.error("Error in fetchRelatedProjects client:", error);
    return [];
  }
}

export async function saveProject(project: Partial<ProjectArticle>): Promise<MutationResult<ProjectArticle>> {
  try {
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to save project" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id: number): Promise<MutationResult<never>> {
  try {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to delete project" };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function fetchCertifications(): Promise<Certificate[]> {
  try {
    const res = await fetch("/api/certifications");
    if (!res.ok) throw new Error("Failed to fetch certifications");
    const data = await res.json();
    return data.certifications;
  } catch (error) {
    console.error("Error in fetchCertifications client:", error);
    throw error;
  }
}

export async function saveCertification(cert: Partial<Certificate>): Promise<MutationResult<Certificate>> {
  try {
    const res = await fetch("/api/admin/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cert)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to save certification" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCertification(id: number): Promise<MutationResult<never>> {
  try {
    const res = await fetch(`/api/admin/certifications/${id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to delete certification" };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
