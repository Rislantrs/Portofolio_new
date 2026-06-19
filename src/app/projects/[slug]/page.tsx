import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ExternalLink,
  Cpu, 
  Network, 
  Brain, 
  Globe, 
  Lock, 
  Shield, 
  Key, 
  LineChart, 
  Wifi, 
  Layers
} from "lucide-react";
import ClientOnlyCustomCursor from "@/components/ClientOnlyCustomCursor";
import {
  fetchProjectBySlug,
  fetchRelatedProjects,
  fetchPublishedProjects,
} from "@/lib/db";
import { type ProjectContentBlock } from "@/lib/projects";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      images: [
        {
          url: project.image,
          alt: project.title,
        },
      ],
    },
  };
}

function imageWidthClass(size: Extract<ProjectContentBlock, { type: "image" }>["size"]) {
  const classes = {
    small: "max-w-md",
    medium: "max-w-2xl",
    large: "max-w-[860px]",
    full: "max-w-[960px]",
  };

  return classes[size];
}

function imageAlignClass(align: Extract<ProjectContentBlock, { type: "image" }>["align"]) {
  const classes = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
    wide: "mx-auto",
  };

  return classes[align];
}

const getTechIconDetails = (name: string) => {
  const clean = name.toLowerCase().trim();

  // 1. Devicon Mapping
  const deviconMap: Record<string, string> = {
    "php": "php",
    "mysql": "mysql",
    "python": "python",
    "flask": "flask",
    "arduino": "arduino",
    "c++": "cplusplus",
    "matlab": "matlab",
    "scikit-learn": "scikitlearn",
    "react": "react",
    "next.js": "nextjs",
    "javascript": "javascript",
    "typescript": "typescript",
    "html": "html5",
    "css": "css3",
  };

  if (deviconMap[clean]) {
    return {
      type: "devicon" as const,
      slug: deviconMap[clean],
    };
  }

  // 2. Simple Icons Mapping
  const simpleIconMap: Record<string, { slug: string; color: string }> = {
    "llama3": { slug: "meta", color: "#044af4" },
    "blynk": { slug: "blynk", color: "#1cf3a6" },
    "esp8266": { slug: "espressif", color: "#e7352c" },
    "xgboost": { slug: "xgboost", color: "#FF6F00" },
    "catboost": { slug: "catboost", color: "#FF5252" },
  };

  if (simpleIconMap[clean]) {
    return {
      type: "simpleicon" as const,
      slug: simpleIconMap[clean].slug,
      color: simpleIconMap[clean].color,
    };
  }

  // 3. Lucide Fallback Mapping
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lucideMap: Record<string, any> = {
    "iot": Cpu,
    "embedded system": Cpu,
    "embedded": Cpu,
    "max30102": Cpu,
    "machine learning": Brain,
    "groq api": Brain,
    "groq": Brain,
    "nlp": Brain,
    "web crawling": Globe,
    "sastrawi": Globe,
    "sdn": Network,
    "ryu controller": Network,
    "mininet-wifi": Wifi,
    "hybrid topo": Layers,
    "regression": LineChart,
    "steganography": Lock,
    "cryptography": Key,
    "security": Shield,
  };

  if (lucideMap[clean]) {
    return {
      type: "lucide" as const,
      icon: lucideMap[clean],
    };
  }

  return {
    type: "lucide" as const,
    icon: Cpu, // default fallback
  };
};

function TechIcon({ name }: { name: string }) {
  const details = getTechIconDetails(name);

  return (
    <div 
      className="group relative flex items-center gap-2 rounded-lg border border-white/5 bg-surface/50 px-2.5 py-1 transition-all duration-300 hover:border-accent/30 hover:bg-surface/80"
      title={name}
    >
      <div className="flex h-4.5 w-4.5 items-center justify-center">
        {details.type === "devicon" && (
          <Image
            src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${details.slug}/${details.slug}-original.svg`}
            alt={name}
            width={18}
            height={18}
            className="h-full w-full object-contain"
          />
        )}
        {details.type === "simpleicon" && (
          <div
            className="h-3.5 w-3.5 shrink-0"
            style={{
              mask: `url(https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/${details.slug}.svg) no-repeat center`,
              WebkitMask: `url(https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/${details.slug}.svg) no-repeat center`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              backgroundColor: details.color || "currentColor",
            }}
          />
        )}
        {details.type === "lucide" && (
          <details.icon size={14} className="text-accent" />
        )}
      </div>
      <span className="font-sans text-[10px] font-semibold text-text-muted transition-colors group-hover:text-accent-light">
        {name}
      </span>
    </div>
  );
}

function ContentBlock({ block }: { block: ProjectContentBlock }) {
  if (block.type === "heading") {
    const Tag = block.level === 2 ? "h2" : "h3";

    return (
      <Tag className="mt-14 font-display text-2xl font-black leading-tight tracking-normal text-accent-light md:text-3xl">
        {block.text}
      </Tag>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p className="font-sans text-[17px] leading-8 text-text-muted md:text-[19px] md:leading-9">
        {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="flex flex-col gap-3 font-sans text-[15px] leading-7 text-text-muted md:text-[17px] md:leading-8">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "image") {
    return (
      <figure className={`${imageWidthClass(block.size)} ${imageAlignClass(block.align)} my-12 w-full`}>
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10 bg-surface">
          <Image
            src={block.src}
            alt={block.alt}
            fill
            sizes="(min-width: 1280px) 860px, (min-width: 768px) 78vw, 92vw"
            className="object-contain"
          />
        </div>
        {block.caption && (
          <figcaption className="mt-3 text-center font-sans text-xs leading-relaxed text-text-subtle">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === "links") {
    return (
      <div className="flex flex-wrap gap-3 pt-2">
        {block.items.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/10 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-accent-light transition-colors hover:border-accent/60 hover:bg-accent/20"
          >
            {item.label}
            <ExternalLink size={14} />
          </a>
        ))}
      </div>
    );
  }

  return null;
}

async function ProjectArticleContent({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) notFound();

  const relatedProjects = await fetchRelatedProjects(project.slug);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: project.image,
    dateCreated: project.year,
    creator: {
      "@type": "Person",
      name: "M Rislan Tristansyah",
    },
  };

  return (
    <>
      <ClientOnlyCustomCursor />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main
        className="min-h-screen bg-bg text-text"
        style={{
          paddingTop: "clamp(88px, 10vh, 132px)",
          paddingBottom: "clamp(140px, 16vh, 220px)",
        }}
      >
        <section className="pb-16 md:pb-20">
          <div className="section-shell-wide flex flex-col gap-10 md:gap-12">
            <nav className="flex flex-wrap items-center gap-3 font-display text-[11px] font-bold uppercase tracking-normal text-text-subtle md:text-xs">
              <Link href="/" className="text-accent transition-colors hover:text-accent-light">
                Portfolio
              </Link>
              <span>/</span>
              <Link href="/projects" className="text-accent transition-colors hover:text-accent-light">
                Projects
              </Link>
              <span>/</span>
              <span>{project.shortTitle}</span>
            </nav>

            <header className="grid gap-8 border-b border-white/5 pb-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="flex max-w-4xl flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-normal text-accent">
                    {project.category}
                  </span>
                  <span className="font-mono text-xs text-text-subtle">Year: {project.year}</span>
                </div>
                <h1 className="font-display text-[clamp(2.5rem,4.6vw,4.9rem)] font-black leading-[1.02] tracking-normal">
                  {project.title}
                </h1>
                <p className="max-w-3xl font-sans text-base leading-8 text-text-muted md:text-lg md:leading-9">
                  {project.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {project.tags.map((tag) => (
                    <TechIcon key={tag} name={tag} />
                  ))}
                </div>
              </div>

              <aside className="rounded-lg border border-white/5 bg-surface/80 p-5 lg:mt-8">
                <dl className="grid grid-cols-1 gap-5">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-normal text-text-subtle">
                      Role
                    </dt>
                    <dd className="mt-2 font-sans text-sm text-accent-light">{project.role}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-normal text-text-subtle">
                      Stack
                    </dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <TechIcon key={tag} name={tag} />
                      ))}
                    </dd>
                  </div>
                  {(project.github || project.demo) && (
                    <div className="flex flex-wrap gap-3 border-t border-white/5 pt-5">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-display text-xs font-bold uppercase tracking-normal text-text transition-colors hover:border-accent/40 hover:bg-white/10"
                        >
                          GitHub
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 font-display text-xs font-bold uppercase tracking-normal text-black transition-colors hover:bg-accent-light"
                        >
                          Live
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </dl>
              </aside>
            </header>

            <div className="relative mx-auto mb-8 aspect-video md:aspect-[21/9] w-full max-w-none overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_0_50px_rgba(0,0,0,0.8),0_20px_50px_rgba(0,0,0,0.4)]">
              {/* Blurred background layer */}
              <Image
                src={project.image}
                alt=""
                fill
                priority
                className="object-cover blur-3xl opacity-40 scale-105 pointer-events-none select-none"
              />
              {/* Centered clean image layer */}
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 1280px) 1400px, 100vw"
                className="object-contain relative z-10"
              />
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-bg/25 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        <article className="pt-10 pb-28 md:pt-14 md:pb-36">
          <div className="section-shell flex max-w-[780px] flex-col gap-8">
            {project.content.map((block) => (
              <ContentBlock key={block.id} block={block} />
            ))}
          </div>
        </article>

        {relatedProjects.length > 0 && (
          <section className="border-t border-white/5 pt-20 pb-40 md:pt-24 md:pb-52">
            <div className="section-shell-wide flex flex-col gap-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-xs font-bold uppercase tracking-normal text-accent">
                    Keep exploring
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-black tracking-normal text-accent-light">
                    Related projects
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="hidden font-display text-xs font-bold uppercase tracking-normal text-accent transition-colors hover:text-accent-light md:block"
                >
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.slug}
                    href={`/projects/${relatedProject.slug}`}
                    className="group rounded-lg border border-white/5 bg-surface p-4 transition-colors hover:border-accent/40"
                  >
                    <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-md bg-bg-elevated">
                      <Image
                        src={relatedProject.image}
                        alt={relatedProject.title}
                        fill
                        sizes="(min-width: 768px) 28vw, 90vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-normal text-text-subtle">
                      {relatedProject.category}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-black leading-tight tracking-normal text-accent-light">
                      {relatedProject.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
        <div aria-hidden="true" className="h-24 md:h-32" />
      </main>
    </>
  );
}

import { Suspense } from "react";

export default function ProjectArticlePage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg text-text-muted">
          <span>Loading project...</span>
        </div>
      }
    >
      <ProjectArticleContent params={params} />
    </Suspense>
  );
}
