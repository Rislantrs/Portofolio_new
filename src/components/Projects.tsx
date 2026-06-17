"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { motion } from "framer-motion";
import { useProjectsTimeline } from "@/hooks/useProjectsTimeline";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";

interface Project {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  year: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  github?: string;
  demo?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    slug: "mpk-osis-man-purwakarta",
    title: "Website MPK OSIS MAN Purwakarta",
    shortTitle: "OSIS MAN",
    year: "2024",
    description: "A collaborative project developing an official profile website for MPK OSIS MAN Purwakarta with dynamic content management features. The team of 11 students also conducted an AI seminar for the school's students.",
    category: "Web Development",
    tags: ["PHP", "MySQL", "School Profile", "Consulting"],
    image: "/assets/mpkosis.png",
    demo: "https://mpkosis-manpwk.web.id/",
    featured: true,
  },
  {
    id: 2,
    slug: "hedom-heart-rate-oxygen-monitor",
    title: "HEDOM: Heart Rate & Oxygen Monitor",
    shortTitle: "HEDOM IoT",
    year: "2024",
    description: "An innovative IoT device for real-time heart rate and SpO₂ monitoring using MAX30102 sensor, ESP8266, and Blynk integration. Perfect for remote telemedicine cases.",
    category: "IoT / Embedded",
    tags: ["IoT", "ESP8266", "Blynk", "MAX30102"],
    image: "/assets/iot.png",
  },
  {
    id: 3,
    slug: "telco-customer-churn-prediction",
    title: "Telco Customer Churn Prediction",
    shortTitle: "Telco Churn",
    year: "2024",
    description: "XGBoost-based churn classification model achieving F1-Score 92.1%, Recall 89.8%, Precision 94.4%, and ROC AUC 99.0% on IBM Telco dataset.",
    category: "Machine Learning",
    tags: ["Machine Learning", "XGBoost", "Python", "IBM Dataset"],
    image: "/assets/Pembanding.png",
    github: "https://github.com/Rislantrs/Machine-Learning/tree/main/Project%20Telco%20churn",
  },
  {
    id: 4,
    slug: "ai-sentiment-analysis-lexicon-based",
    title: "AI Sentiment Analysis — Lexicon Based",
    shortTitle: "Sentiment AI",
    year: "2024",
    description: "YouTube comment sentiment analysis using Lexicon Based method on 1,054 comments with Sastrawi preprocessing and InSet dictionary.",
    category: "Natural Language Processing",
    tags: ["NLP", "Web Crawling", "Python", "Sastrawi"],
    image: "/assets/lexicon.png",
    github: "https://github.com/Rislantrs/Analisis-Sentimen-Prasiskom3",
  },
  {
    id: 5,
    slug: "sdn-library-network-case-study",
    title: "SDN — Library Network Case Study",
    shortTitle: "SDN Network",
    year: "2023",
    description: "Software Defined Networking implementation using hybrid topology with Ryu controller and Mininet WiFi, testing scalability from 10 to 100 users.",
    category: "Networking",
    tags: ["SDN", "Ryu Controller", "Mininet-WiFi", "Hybrid Topo"],
    image: "/assets/SDN.png",
  },
  {
    id: 6,
    slug: "web-ajaib-interactive-digital-platform",
    title: "WEB AJAIB — Interactive Digital Platform",
    shortTitle: "Web Ajaib",
    year: "2025",
    description: "An interactive platform combining entertainment, education, and social awareness in one digital experience. Designed to prove that technology can be a force for good, featuring unique and enlightening features powered by Groq Llama3 model.",
    category: "Web & AI",
    tags: ["Flask", "Groq API", "Python", "Llama3"],
    image: "/assets/Cuplikan layar 2025-11-02 233325.png",
    demo: "https://web-ajaib.vercel.app/",
    featured: true,
  },
  {
    id: 7,
    slug: "house-price-prediction-catboost",
    title: "House Price Prediction — CatBoost",
    shortTitle: "CatBoost Price",
    year: "2024",
    description: "CatBoost regression model achieving R² = 0.9930 for house price prediction. Analysis shows building quality and total surface area are the most influential features.",
    category: "Machine Learning",
    tags: ["Python", "CatBoost", "Scikit-Learn", "Regression"],
    image: "/assets/rumah.png",
    github: "https://github.com/Rislantrs/Prasiskom2-Project-Prediksi-Harga-Rumah",
  },
  {
    id: 8,
    slug: "hapino-happy-arduino",
    title: "HAPINO — Happy Arduino",
    shortTitle: "HAPINO IoT",
    year: "2023",
    description: "Creative Arduino Uno project that plays 'Happy Birthday' musical note, sweeps physical servo gates, lights RGB LEDs, and displays LCD messages on button press.",
    category: "IoT / Embedded",
    tags: ["Arduino", "IoT", "Embedded System", "C++"],
    image: "/assets/Uno.png",
    github: "https://drive.google.com/drive/u/1/folders/1tAoaLIUd6-Hh7cDGcS7JON4q5bH5It3y",
  },
  {
    id: 9,
    slug: "lsb-steganography-matlab",
    title: "LSB Steganography — MATLAB",
    shortTitle: "MATLAB Stego",
    year: "2023",
    description: "Least Significant Bit steganography implementation for embedding and extracting hidden text messages in digital cover images, measuring structural PSNR and SSIM quality.",
    category: "Cyber Security",
    tags: ["MATLAB", "Steganography", "Cryptography", "Security"],
    image: "/assets/stego.jpeg",
    github: "https://github.com/Rislantrs/Steganografi",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

const deviconBase = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const techMarks: Record<string, { label: string; color: string; icon?: string; invert?: boolean }> = {
  PHP: { label: "PHP", color: "#8993be", icon: `${deviconBase}/php/php-original.svg`, invert: true },
  MySQL: { label: "SQL", color: "#f29111", icon: `${deviconBase}/mysql/mysql-original.svg` },
  "School Profile": { label: "WEB", color: "#38bdf8" },
  Consulting: { label: "UX", color: "#facc15" },
  IoT: { label: "IoT", color: "#22c55e" },
  ESP8266: { label: "ESP", color: "#14b8a6" },
  Blynk: { label: "BY", color: "#84cc16" },
  MAX30102: { label: "HR", color: "#ef4444" },
  "Machine Learning": { label: "ML", color: "#a78bfa" },
  XGBoost: { label: "XGB", color: "#f97316" },
  Python: { label: "PY", color: "#3776ab", icon: `${deviconBase}/python/python-original.svg` },
  "IBM Dataset": { label: "IBM", color: "#60a5fa" },
  NLP: { label: "NLP", color: "#ec4899" },
  "Web Crawling": { label: "CRW", color: "#f59e0b" },
  Sastrawi: { label: "ID", color: "#fb7185" },
  SDN: { label: "SDN", color: "#06b6d4" },
  "Ryu Controller": { label: "RYU", color: "#64748b" },
  "Mininet-WiFi": { label: "NET", color: "#10b981" },
  "Hybrid Topo": { label: "TOP", color: "#fde047" },
  Flask: { label: "FL", color: "#e5e7eb", icon: `${deviconBase}/flask/flask-original.svg`, invert: true },
  "Groq API": { label: "GQ", color: "#f43f5e" },
  Llama3: { label: "L3", color: "#fb923c" },
  CatBoost: { label: "CAT", color: "#facc15" },
  "Scikit-Learn": { label: "SK", color: "#f97316", icon: `${deviconBase}/scikitlearn/scikitlearn-original.svg` },
  Regression: { label: "RG", color: "#34d399" },
  Arduino: { label: "ARD", color: "#00979d", icon: `${deviconBase}/arduino/arduino-original.svg` },
  "Embedded System": { label: "EMB", color: "#22c55e" },
  "C++": { label: "C++", color: "#60a5fa", icon: `${deviconBase}/cplusplus/cplusplus-original.svg` },
  MATLAB: { label: "MAT", color: "#f97316", icon: `${deviconBase}/matlab/matlab-original.svg` },
  Steganography: { label: "STG", color: "#a3e635" },
  Cryptography: { label: "CRY", color: "#818cf8" },
  Security: { label: "SEC", color: "#f87171" },
};

function getTechMark(tag: string) {
  if (techMarks[tag]) return techMarks[tag];

  const label = tag
    .split(/[\s/-]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return { label: label || "DEV", color: "#d7d7d7" };
}

// ─── ProjectCard ───────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  const [imageSrc, setImageSrc] = useState(project.image);
  const visibleTech = project.tags.slice(0, 4);

  // 2 rounded (top-left & bottom-right), 2 sharp (top-right & bottom-left)
  const outerRadius = "48px 0px 48px 0px";
  const innerRadius = "46px 0px 46px 0px";

  return (
    <div
      onClick={onClick}
      className="group relative h-full w-full cursor-pointer select-none transition-transform duration-500 hover:-translate-y-1.5"
    >
      {/* Outer border & shadow container */}
      <div
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_40%,rgba(0,0,0,0.8))] shadow-[0_20px_45px_rgba(0,0,0,0.6)] border border-white/5 transition-all duration-500 group-hover:border-white/20"
        style={{ borderRadius: outerRadius }}
      />

      {/* Inner card frame */}
      <div
        className="relative flex h-full min-h-[220px] flex-col overflow-hidden bg-[#111] p-1.5"
        style={{ borderRadius: outerRadius }}
      >
        {/* Content Box */}
        <div 
          className="relative z-10 flex h-full min-w-0 flex-col overflow-hidden bg-[#0c0c0c] border border-white/5" 
          style={{ borderRadius: innerRadius }}
        >
          {/* Image Container (Simple, Premium, Visible Contrast) */}
          <div className="relative min-h-0 flex-1 overflow-hidden bg-gradient-to-b from-[#22201d] to-[#0d0c0b] border-b border-white/5">
            <Image
              src={imageSrc}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
              className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03] drop-shadow-[0_6px_15px_rgba(0,0,0,0.5)]"
              onError={() => setImageSrc("/assets/IMG_0304.JPG")}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="type-meta absolute right-3 top-3 rounded-full bg-black/80 border border-white/10 px-2 py-0.5 text-accent text-[9px] font-bold">
              {project.year}
            </span>
          </div>

          {/* Project Details Bottom Area */}
          <div className="shrink-0 bg-[#0e0e0e]">
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-[#141414] to-[#0a0a0a] px-3.5 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="min-w-0 flex-1 truncate text-[0.8rem] font-bold uppercase leading-none tracking-normal text-white group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <span className="type-meta shrink-0 text-accent font-bold text-[10px]">{project.shortTitle}</span>
              </div>
            </div>

            {/* Tech Stack Bar */}
            <div className="flex h-10 items-center gap-2 border-t border-white/5 bg-[#0a0a0a] px-3.5">
              <span className="type-meta shrink-0 text-white/40 text-[9px] font-bold">STACK</span>
              <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                {visibleTech.map((tag) => {
                  const tech = getTechMark(tag);

                  return (
                    <span
                      key={tag}
                      title={tag}
                      aria-label={tag}
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-[0.45rem] font-bold text-text-muted shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] hover:bg-white/10 transition-colors"
                    >
                      {tech.icon ? (
                        <img 
                          src={tech.icon} 
                          alt="" 
                          className={`h-4 w-4 object-contain ${tech.invert ? "invert brightness-200" : ""}`} 
                        />
                      ) : (
                        <span className="text-[8px] font-bold tracking-tight text-white">{tech.label}</span>
                      )}
                    </span>
                  );
                })}
              </div>
              <span className="type-meta shrink-0 text-white/30 text-[9px] font-bold group-hover:text-accent transition-colors">VIEW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ProjectModal ──────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [imageSrc, setImageSrc] = useState(project.image);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-bg-elevated border border-white/15 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Close modal" className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 text-white hover:bg-accent hover:text-black transition-all duration-300 cursor-pointer">
          <X size={18} />
        </button>

        <div className="w-full md:w-1/2 h-[220px] md:h-[450px] relative overflow-hidden">
          <Image
            src={imageSrc}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            onError={() => setImageSrc("/assets/IMG_0304.JPG")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated to-transparent md:bg-gradient-to-r md:from-transparent md:to-bg-elevated" />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between gap-6 min-h-[300px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="type-meta rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-accent">{project.category}</span>
              <span className="type-small text-text-muted">Year: {project.year}</span>
            </div>
            <h3 className="type-panel-title text-accent-light">{project.title}</h3>
            <p className="type-small text-text-muted">{project.description}</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span key={i} className="type-meta rounded-full bg-accent/5 border border-accent/15 px-2.5 py-0.5 text-accent-light">{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-2 border-t border-white/5">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="type-action flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /></svg>
                  GitHub
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  className="type-action flex-1 py-3 rounded-xl bg-accent hover:bg-accent-light text-black transition-all flex items-center justify-center gap-2">
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
              {!project.github && !project.demo && (
                <span className="type-action w-full py-3 rounded-xl bg-white/5 border border-white/5 text-text-subtle text-center">Internal Case Study</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile layout ─────────────────────────────────────────────────────────
function MobileCard({
  project,
  onClick,
  reduceMotion,
}: {
  project: Project;
  onClick: () => void;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { y: 24, opacity: 0 }}
      whileInView={reduceMotion ? undefined : { y: 0, opacity: 1 }}
      viewport={reduceMotion ? undefined : { once: true, margin: "-40px" }}
      transition={reduceMotion ? undefined : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="mobile-proj-card w-full min-h-[300px] aspect-[4/3]"
    >
      <ProjectCard project={project} onClick={onClick} />
    </motion.div>
  );
}

// ─── Main Combined Projects & Teaser Component ─────────────────────────────
export default function Projects() {
  const router = useRouter();
  const isLowEnd = useLowEndDevice();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLDivElement>(null);
  const teaserLogoRef = useRef<HTMLDivElement>(null);
  const teaserTextRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(3);
      else if (window.innerWidth >= 768) setColumns(2);
      else setColumns(1);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const rowsPerPage = 2;
  const cardsPerPage = columns * rowsPerPage;
  const pages = chunk(projects, cardsPerPage);
  const isPinned = columns > 1 && pages.length >= 1;
  const openProject = (project: Project) => router.push(`/projects/${project.slug}`);

  useProjectsTimeline({
    columns,
    isPinned,
    pagesLength: pages.length,
    sectionRef,
    stageRef,
    teaserRef,
    teaserLogoRef,
    teaserTextRef,
    pageRefs,
  });

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={`relative w-full bg-bg ${isPinned ? "overflow-hidden" : "py-20"}`}
      style={isPinned ? { height: "100svh" } : undefined}
    >
      {/* ── UNIFIED TEASER OVERLAY (Active only when pinned on desktop) ── */}
      {isPinned && (
        <div
          ref={teaserRef}
          className="absolute inset-0 w-full h-full z-40 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{ backgroundColor: "#050505" }}
        >
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:5rem_5rem]" />

          {/* Logo */}
          <div
            ref={teaserLogoRef}
            className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center pointer-events-none z-10"
            style={{ opacity: 0 }}
          >
            <Image
              src="/assets/Logo_sider.svg"
              alt="Slider Logo"
              width={500}
              height={500}
              className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.15)]"
              priority
            />
          </div>

          {/* Text */}
          <div className="absolute w-full flex items-center overflow-hidden pointer-events-none z-20">
            <div
              ref={teaserTextRef}
              className="whitespace-nowrap flex gap-8 md:gap-10 items-center text-[12vw] md:text-[9vw] font-mega uppercase tracking-normal leading-none select-none px-4"
            >
              <span className="font-black text-neutral-900/55">EXPLORE MY</span>
              <span className="font-black italic text-neutral-950 drop-shadow-[0_12px_24px_rgba(0,0,0,0.14)]">PROJECTS</span>
              <span className="text-accent font-black">✦</span>
              <span className="font-black text-neutral-900/55">THE WORKS I</span>
              <span className="font-black italic text-neutral-950 drop-shadow-[0_12px_24px_rgba(0,0,0,0.14)]">BUILT</span>
            </div>
          </div>

          <div className="type-meta absolute bottom-10 left-10 text-black/20 dark:text-white/10 pointer-events-none select-none">
            03b — PROJECT TEASER
          </div>
        </div>
      )}

      {/* ── PROJECTS CONTENT STAGE ── */}
      <div
        ref={stageRef}
        className="section-shell h-full flex flex-col py-8 relative z-10"
        style={isPinned ? { opacity: 0 } : undefined}
      >
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-6 shrink-0">
          <div className="type-kicker flex items-center gap-3 text-accent select-none">
            <span className="w-8 h-[1px] bg-accent" />
            04 — CASE STUDIES
          </div>
          <h2 className="type-section-title select-none">
            Selected <span className="text-accent-light italic">Works</span>
          </h2>
        </div>

        {isPinned ? (
          /* Pinned layout: page panels */
          <div className="relative flex-1 overflow-hidden">
            {pages.map((pageProjects, pi) => (
              <div
                key={pi}
                ref={(el) => { pageRefs.current[pi] = el; }}
                className={`absolute inset-0 grid gap-3 pointer-events-none ${
                  columns === 3 ? "grid-cols-3" : "grid-cols-2"
                } grid-rows-2`}
              >
                {pageProjects.map((project) => (
                  <div key={project.id} className="proj-card w-full h-full">
                    <ProjectCard project={project} onClick={() => openProject(project)} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* Mobile layout: standard scrolling */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            {projects.map((project) => (
              <MobileCard
                key={project.id}
                project={project}
                onClick={() => openProject(project)}
                reduceMotion={isLowEnd}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
