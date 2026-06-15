import Image from "next/image";
import Link from "next/link";
import ClientOnlyCustomCursor from "@/components/ClientOnlyCustomCursor";
import { publishedProjects } from "@/lib/projects";

export const metadata = {
  title: "Project Articles",
  description: "Detailed case studies and project articles by M Rislan Tristansyah.",
};

export default function ProjectsIndexPage() {
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
            <div className="flex max-w-4xl flex-col gap-4">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-accent">
                Case studies
              </p>
              <h1 className="font-display text-5xl font-black leading-none tracking-tighter md:text-7xl">
                Project <span className="text-accent-light italic">Articles</span>
              </h1>
              <p className="max-w-2xl font-sans text-sm leading-relaxed text-text-muted md:text-base">
                A deeper view into the selected works, including context, process, stack,
                results, and useful links.
              </p>
            </div>
          </header>

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {publishedProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group overflow-hidden rounded-lg border border-white/5 bg-surface transition-colors hover:border-accent/40"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                </div>
                <div className="flex min-h-[220px] flex-col justify-between gap-5 p-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-text-subtle">
                      <span>{project.category}</span>
                      <span>{project.year}</span>
                    </div>
                    <h2 className="font-display text-2xl font-black leading-tight tracking-tight text-accent-light">
                      {project.title}
                    </h2>
                    <p className="font-sans text-sm leading-relaxed text-text-muted">
                      {project.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-accent/15 bg-accent/5 px-2.5 py-1 font-sans text-[10px] font-semibold text-accent-light"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
