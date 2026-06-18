import { supabase } from "./supabase";
import { projects, type ProjectArticle } from "./projects";
import { certificates, type Certificate } from "./certifications";

const isSupabaseConfigured = (): boolean => {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

type MutationResult<T> = { success: boolean; data?: T; error?: string };

type ProjectDbRow = {
  id: number | string;
  slug: string;
  title: string;
  short_title?: string | null;
  year: string;
  description: string;
  category: string;
  tags?: string[] | null;
  image: string;
  github?: string | null;
  demo?: string | null;
  featured?: boolean | null;
  role?: string | null;
  status?: ProjectArticle["status"] | null;
  summary?: string | null;
  content?: ProjectArticle["content"] | null;
};

type CertificateDbRow = {
  id: number | string;
  name: string;
  organizer: string;
  year: string;
  category: Certificate["category"];
  badge_name?: string | null;
  badge_icon?: string | null;
  link?: string | null;
};

const omitId = <T extends { id?: unknown }>(item: T): Omit<T, "id"> => {
  const { id: omittedId, ...rest } = item;
  void omittedId;
  return rest;
};

// --- Mappers ---
const mapProject = (item: ProjectDbRow): ProjectArticle => ({
  id: Number(item.id),
  slug: item.slug,
  title: item.title,
  shortTitle: item.short_title || item.title,
  year: item.year,
  description: item.description,
  category: item.category,
  tags: Array.isArray(item.tags) ? item.tags : [],
  image: item.image,
  github: item.github || undefined,
  demo: item.demo || undefined,
  featured: !!item.featured,
  role: item.role || "",
  status: item.status || "published",
  summary: item.summary || "",
  content: Array.isArray(item.content) ? item.content : [],
});

const mapProjectToDb = (item: Partial<ProjectArticle>) => ({
  id: item.id,
  slug: item.slug,
  title: item.title,
  short_title: item.shortTitle,
  year: item.year,
  description: item.description,
  category: item.category,
  tags: item.tags,
  image: item.image,
  github: item.github || null,
  demo: item.demo || null,
  featured: item.featured,
  role: item.role,
  status: item.status,
  summary: item.summary,
  content: item.content,
});

const mapCertificate = (item: CertificateDbRow): Certificate => ({
  id: Number(item.id),
  name: item.name,
  organizer: item.organizer,
  year: item.year,
  category: item.category,
  badgeName: item.badge_name || "",
  badgeIcon: item.badge_icon || "",
  link: item.link || undefined,
});

const mapCertificateToDb = (item: Partial<Certificate>) => ({
  id: item.id,
  name: item.name,
  organizer: item.organizer,
  year: item.year,
  category: item.category,
  badge_name: item.badgeName,
  badge_icon: item.badgeIcon,
  link: item.link || null,
});

// --- Projects Queries ---
export async function fetchProjects(): Promise<ProjectArticle[]> {
  if (!isSupabaseConfigured()) return projects;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("id", { ascending: true });

  if (error || !data) {
    console.error("Error fetching projects from Supabase:", error);
    return projects;
  }

  return data.map(mapProject);
}

export async function fetchPublishedProjects(): Promise<ProjectArticle[]> {
  if (!isSupabaseConfigured()) {
    return projects.filter((p) => p.status === "published");
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("id", { ascending: true });

  if (error || !data) {
    console.error("Error fetching published projects:", error);
    return projects.filter((p) => p.status === "published");
  }

  return data.map(mapProject);
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectArticle | null> {
  if (!isSupabaseConfigured()) {
    return projects.find((p) => p.slug === slug) || null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    console.error(`Error fetching project by slug ${slug}:`, error);
    return projects.find((p) => p.slug === slug) || null;
  }

  return mapProject(data);
}

export async function fetchRelatedProjects(slug: string, limit = 3): Promise<ProjectArticle[]> {
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
}

export async function saveProject(project: Partial<ProjectArticle>): Promise<MutationResult<ProjectArticle>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured." };
  }

  const dbData = mapProjectToDb(project);
  let result;
  
  if (project.id) {
    result = await supabase
      .from("projects")
      .update(dbData)
      .eq("id", project.id)
      .select()
      .single();
  } else {
    // Exclude id so that Supabase generates a new identity id if it is configured to auto-increment
    const insertData = omitId(dbData);
    result = await supabase
      .from("projects")
      .insert(insertData)
      .select()
      .single();
  }

  if (result.error) {
    return { success: false, error: result.error.message };
  }

  return { success: true, data: mapProject(result.data) };
}

export async function deleteProject(id: number): Promise<MutationResult<never>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured." };
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

// --- Certifications Queries ---
export async function fetchCertifications(): Promise<Certificate[]> {
  if (!isSupabaseConfigured()) return certificates;

  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("id", { ascending: true });

  if (error || !data) {
    console.error("Error fetching certifications from Supabase:", error);
    return certificates;
  }

  return data.map(mapCertificate);
}

export async function saveCertification(cert: Partial<Certificate>): Promise<MutationResult<Certificate>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured." };
  }

  const dbData = mapCertificateToDb(cert);
  let result;

  if (cert.id) {
    result = await supabase
      .from("certifications")
      .update(dbData)
      .eq("id", cert.id)
      .select()
      .single();
  } else {
    const insertData = omitId(dbData);
    result = await supabase
      .from("certifications")
      .insert(insertData)
      .select()
      .single();
  }

  if (result.error) {
    return { success: false, error: result.error.message };
  }

  return { success: true, data: mapCertificate(result.data) };
}

export async function deleteCertification(id: number): Promise<MutationResult<never>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured." };
  }

  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
