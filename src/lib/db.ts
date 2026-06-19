import dbConnect from "./mongodb";
import Project from "@/models/Project";
import CertificateModel from "@/models/Certificate";
import { projects as fallbackProjects, type ProjectArticle } from "./projects";
import { certificates as fallbackCertificates, type Certificate } from "./certifications";

// Mencegah serialization error pada Server Components (seperti tipe ObjectId atau Date)
function cleanDbData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export async function fetchProjects(): Promise<ProjectArticle[]> {
  try {
    await dbConnect();
    const list = await Project.find({}).sort({ id: 1 }).lean();
    if (list.length === 0) {
      console.log("No projects found in MongoDB, using fallback data.");
      return fallbackProjects;
    }
    return cleanDbData(list) as unknown as ProjectArticle[];
  } catch (error) {
    console.error("Error fetching projects from MongoDB:", error);
    return fallbackProjects;
  }
}

export async function fetchPublishedProjects(): Promise<ProjectArticle[]> {
  try {
    await dbConnect();
    const list = await Project.find({ status: "published" }).sort({ id: 1 }).lean();
    if (list.length === 0) {
      console.log("No published projects found in MongoDB, using fallback data.");
      return fallbackProjects.filter(p => p.status === "published");
    }
    return cleanDbData(list) as unknown as ProjectArticle[];
  } catch (error) {
    console.error("Error fetching published projects from MongoDB:", error);
    return fallbackProjects.filter(p => p.status === "published");
  }
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectArticle | null> {
  try {
    await dbConnect();
    const project = await Project.findOne({ slug }).lean();
    if (!project) {
      console.log(`Project with slug ${slug} not found in MongoDB, using fallback data.`);
      return fallbackProjects.find((p) => p.slug === slug) || null;
    }
    return cleanDbData(project) as unknown as ProjectArticle;
  } catch (error) {
    console.error(`Error fetching project by slug ${slug}:`, error);
    return fallbackProjects.find((p) => p.slug === slug) || null;
  }
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

export async function fetchCertifications(): Promise<Certificate[]> {
  try {
    await dbConnect();
    const list = await CertificateModel.find({}).sort({ id: 1 }).lean();
    if (list.length === 0) {
      console.log("No certifications found in MongoDB, using fallback data.");
      return fallbackCertificates;
    }
    return cleanDbData(list) as unknown as Certificate[];
  } catch (error) {
    console.error("Error fetching certifications from MongoDB:", error);
    return fallbackCertificates;
  }
}
