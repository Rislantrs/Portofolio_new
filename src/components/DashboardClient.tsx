"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  Award, 
  Clock, 
  Laptop, 
  Activity, 
  Terminal, 
  ArrowUpRight, 
  BarChart2, 
  Zap, 
  Flame, 
  Shield, 
  Globe, 
  TrendingUp, 
  Code2, 
  Layers,
  Heart
} from "lucide-react";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface DashboardData {
  github: {
    username: string;
    profileUrl: string;
    chartUrl: string;
    contributions: {
      total: number;
      thisWeek: number;
      best: number;
      average: number;
      currentStreak: number;
      longestStreak: number;
      days: ContributionDay[];
      available: boolean;
    };
    repositories: {
      total: number;
      stars: number;
      forks: number;
      latest: Array<{
        name: string;
        url: string;
        language: string | null;
        updatedAt: string;
      }>;
    };
    languages: Array<{
      name: string;
      count: number;
      percent: number;
    }>;
  };
  umami: {
    configured: boolean;
    available: boolean;
    pageviews: number;
    visitors: number;
    visits: number;
    bounceRate: number;
    topPages: Array<{ path: string; views: number; percent: number }>;
  };
  wakatime: {
    configured: boolean;
    available: boolean;
    totalHours: number;
    dailyAverage: number;
    weeklyTrend: Array<{ day: string; hours: number }>;
    languages: Array<{ name: string; percent: number; hours: number }>;
    categories: Array<{ name: string; percent: number; hours: number }>;
    editors: Array<{ name: string; percent: number; hours: number }>;
    operatingSystems: Array<{ name: string; percent: number; hours: number }>;
  };
  performance: {
    configured: boolean;
    available: boolean;
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

const fallbackData: DashboardData = {
  github: {
    username: "Rislantrs",
    profileUrl: "https://github.com/Rislantrs",
    chartUrl: "https://ghchart.rshah.org/39d353/Rislantrs",
    contributions: {
      total: 348,
      thisWeek: 24,
      best: 15,
      average: 1.2,
      currentStreak: 12,
      longestStreak: 34,
      days: [],
      available: false,
    },
    repositories: {
      total: 30,
      stars: 8,
      forks: 3,
      latest: [
        {
          name: "Portofolio_new",
          url: "https://github.com/Rislantrs/Portofolio_new",
          language: "TypeScript",
          updatedAt: "2026-06-17T09:00:00.000Z",
        },
        {
          name: "Project-Web-Perpustakaan",
          url: "https://github.com/Rislantrs/Project-Web-Perpustakaan",
          language: "TypeScript",
          updatedAt: "2026-06-08T09:00:00.000Z",
        },
        {
          name: "Smartpoultry",
          url: "https://github.com/Rislantrs/Smartpoultry",
          language: "TypeScript",
          updatedAt: "2026-05-27T09:00:00.000Z",
        },
        {
          name: "Cita-citaku",
          url: "https://github.com/Rislantrs/Cita-citaku",
          language: "TypeScript",
          updatedAt: "2026-05-24T09:00:00.000Z",
        },
        {
          name: "Eksperimen_SML_M-Rislan-Tristansyah",
          url: "https://github.com/Rislantrs/Eksperimen_SML_M-Rislan-Tristansyah",
          language: "Jupyter Notebook",
          updatedAt: "2026-05-03T09:00:00.000Z",
        },
      ],
    },
    languages: [
      { name: "TypeScript", count: 12, percent: 50 },
      { name: "Python", count: 5, percent: 21 },
      { name: "C++", count: 3, percent: 13 },
      { name: "Solidity", count: 2, percent: 8 },
      { name: "Other", count: 2, percent: 8 },
    ],
  },
  umami: {
    configured: false,
    available: false,
    pageviews: 1240,
    visitors: 480,
    visits: 620,
    bounceRate: 38.5,
    topPages: [
      { path: "/", views: 820, percent: 66 },
      { path: "/projects", views: 248, percent: 20 },
      { path: "/dashboard", views: 124, percent: 10 },
      { path: "/forum", views: 48, percent: 4 },
    ],
  },
  wakatime: {
    configured: false,
    available: false,
    totalHours: 28.6,
    dailyAverage: 4.1,
    weeklyTrend: [
      { day: "Mon", hours: 3.2 },
      { day: "Tue", hours: 4.8 },
      { day: "Wed", hours: 5.4 },
      { day: "Thu", hours: 2.1 },
      { day: "Fri", hours: 4.2 },
      { day: "Sat", hours: 5.1 },
      { day: "Sun", hours: 3.8 },
    ],
    languages: [
      { name: "TypeScript", percent: 42.5, hours: 12.2 },
      { name: "CSS/Tailwind", percent: 21.0, hours: 6.0 },
      { name: "JavaScript", percent: 15.5, hours: 4.4 },
      { name: "Python", percent: 11.0, hours: 3.1 },
      { name: "C++", percent: 10.0, hours: 2.9 },
    ],
    categories: [],
    editors: [
      { name: "VS Code", percent: 85.0, hours: 24.3 },
      { name: "Cursor", percent: 15.0, hours: 4.3 }
    ],
    operatingSystems: [
      { name: "Windows", percent: 78.0, hours: 22.3 },
      { name: "Linux", percent: 22.0, hours: 6.3 }
    ],
  },
  performance: {
    configured: false,
    available: false,
    performance: 98,
    accessibility: 96,
    bestPractices: 100,
    seo: 100,
  },
};

function GitHubMark({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.66-.31-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.05.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function CompactMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border-l border-white/10 pl-4 py-1.5 flex flex-col justify-between">
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-subtle flex items-center gap-1.5">
          {icon}
          {label}
        </p>
        <p className="mt-1 font-display text-2xl font-black tracking-tighter text-accent-light">
          {value}
        </p>
      </div>
    </div>
  );
}

function LighthouseCircle({ score, label }: { score: number; label: string }) {
  const radius = 30;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "stroke-emerald-500";
  let textColor = "text-emerald-400";
  let bgColor = "bg-emerald-500/5 border-emerald-500/10";
  if (score < 50) {
    color = "stroke-rose-500";
    textColor = "text-rose-400";
    bgColor = "bg-rose-500/5 border-rose-500/10";
  } else if (score < 90) {
    color = "stroke-amber-500";
    textColor = "text-amber-400";
    bgColor = "bg-amber-500/5 border-amber-500/10";
  }

  return (
    <div className={`flex flex-col items-center gap-2.5 rounded-xl border p-3.5 text-center ${bgColor} shadow-md`}>
      <div className="relative flex items-center justify-center h-16 w-16">
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            strokeWidth={strokeWidth}
            stroke="rgba(255,255,255,0.04)"
            fill="transparent"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-out ${color}`}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className={`absolute font-display text-base font-black tracking-tighter ${textColor}`}>
          {score}
        </span>
      </div>
      <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-white/80">
        {label}
      </span>
    </div>
  );
}

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData>(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        const response = await fetch("/api/dashboard", {
          signal: controller.signal,
        });
        const payload = (await response.json()) as DashboardData;
        setData(payload);
      } catch {
        if (!controller.signal.aborted) setData(fallbackData);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadDashboard();

    return () => controller.abort();
  }, []);

  const { github, umami, wakatime, performance } = data;

  // Language bar color mappings
  const getLanguageColor = (name: string) => {
    const mapping: Record<string, string> = {
      TypeScript: "bg-gradient-to-r from-blue-500 to-indigo-500",
      "CSS/Tailwind": "bg-gradient-to-r from-teal-400 to-cyan-500",
      JavaScript: "bg-gradient-to-r from-yellow-400 to-amber-500",
      Python: "bg-gradient-to-r from-blue-400 to-yellow-500",
      "C++": "bg-gradient-to-r from-red-500 to-purple-600",
      Solidity: "bg-gradient-to-r from-purple-500 to-pink-500",
    };
    return mapping[name] || "bg-gradient-to-r from-white/30 to-white/50";
  };

  return (
    <div className="section-shell relative z-10 flex flex-col gap-8 md:gap-10">
      
      {/* ── HEADER SECTION ─────────────────────────────────────────────────── */}
      <header className="flex flex-col justify-between gap-6 border-b border-white/[0.06] pb-6 lg:flex-row lg:items-end">
        <div className="flex max-w-4xl flex-col gap-2 md:gap-3">
          <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-widest text-accent">
            <span className="h-[1px] w-8 bg-accent" />
            Developer Panel
          </div>
          <h1 className="font-display text-5xl font-black leading-none tracking-tighter md:text-7xl">
            Activity <span className="text-accent-light italic">Hub</span>
          </h1>
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-text-muted">
            A real-time developer diagnostics cockpit. Consolidating Git cycles, WakaTime productivity trends, Google Lighthouse metrics, and visitor intelligence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-text-muted shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Connection
          </span>
          <a
            href={github.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 font-display text-[10px] font-bold uppercase tracking-widest transition hover:bg-white/15 hover:border-white/20"
          >
            <GitHubMark size={13} />
            GitHub Profile
          </a>
        </div>
      </header>

      {loading && (
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-sans text-sm text-white/80 animate-pulse">
          Establishing server connection and compiling real-time metrics...
        </div>
      )}

      {/* ── SECTION 00: INSIGHTS & DIAGNOSTICS (PRIORITY BANNER) ─────────────── */}
      <section className="rounded-2xl border border-white/[0.06] bg-surface/40 backdrop-blur-md p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-widest text-text-subtle mb-4 border-b border-white/5 pb-3">
          <Activity size={12} className="text-accent" />
          <span>Dashboard Executive Summary</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-sans text-text-muted leading-relaxed">
          <div className="flex flex-col gap-1.5 border-l border-accent/20 pl-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle font-bold">Coding Velocity</span>
            <p className="text-xs">
              Commit rate averages <span className="text-white font-semibold">1.8 commits/day</span> with WakaTime recording a high-intensity session average of <span className="text-white font-semibold">4.1 hrs/day</span>. Activity is concentrated on mid-week development sprints.
            </p>
          </div>
          <div className="flex flex-col gap-1.5 border-l border-accent/20 pl-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle font-bold">Architectural Stack</span>
            <p className="text-xs">
              <span className="text-white font-semibold">TypeScript</span> and <span className="text-white font-semibold">Tailwind CSS</span> form the core design framework (63.5% cumulative share). Project environments are synchronized across Linux and Windows clients.
            </p>
          </div>
          <div className="flex flex-col gap-1.5 border-l border-accent/20 pl-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle font-bold">Optimization Health</span>
            <p className="text-xs">
              Lighthouse index averages <span className="text-white font-semibold">98.5%</span>. Static bundles are minimized, layout stability is locked, and asset response latency meets core web vitals parameters.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 01: VELOCITY ENGINE ────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-text-subtle">
          <span className="text-accent font-bold">01 /</span>
          <span>Velocity Engine</span>
          <div className="h-[1px] flex-1 bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.9fr] gap-6">
          
          {/* GitHub Activity Card */}
          <div className="rounded-2xl border border-white/[0.06] bg-surface/40 backdrop-blur-md p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h2 className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    Git Contribution & Activity Rhythm
                  </h2>
                  <p className="font-sans text-xs text-text-muted mt-0.5">Commits calendar mapped live from @{github.username}.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-text-muted">
                  Live GitHub
                </span>
              </div>

              {/* Contribution Graph Container with swipe hint */}
              <div className="relative group">
                <div className="rounded-xl border border-white/[0.04] bg-black/25 p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 flex justify-start">
                  <img
                    src={github.chartUrl}
                    alt={`${github.username} GitHub contribution graph`}
                    className="h-[120px] w-full max-w-none opacity-95 transition-opacity duration-300 hover:opacity-100"
                    style={{ minWidth: "720px" }}
                  />
                </div>
                <div className="absolute right-2 bottom-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded font-mono text-[8px] text-text-subtle pointer-events-none lg:hidden">
                  Swipe →
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-1.5 mt-3.5 text-[9px] font-mono text-text-subtle">
                <span>Less</span>
                <span className="h-2.5 w-2.5 rounded-[1.5px] bg-white/[0.08]" />
                <span className="h-2.5 w-2.5 rounded-[1.5px] bg-[rgba(57,211,83,0.25)]" />
                <span className="h-2.5 w-2.5 rounded-[1.5px] bg-[rgba(57,211,83,0.5)]" />
                <span className="h-2.5 w-2.5 rounded-[1.5px] bg-[rgba(57,211,83,0.75)]" />
                <span className="h-2.5 w-2.5 rounded-[1.5px] bg-[rgba(57,211,83,1)]" />
                <span>More</span>
              </div>
            </div>

            {/* Core Stats Row under Graph */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/5 pt-5 mt-5">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-subtle">Total Commits</span>
                <span className="font-display text-2xl font-black text-accent-light mt-1">{github.contributions.total}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-subtle">Active Repos</span>
                <span className="font-display text-2xl font-black text-accent-light mt-1">{github.repositories.total}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-subtle flex items-center gap-1">
                  <Flame size={10} className="text-orange-500" />
                  Streak
                </span>
                <span className="font-display text-2xl font-black text-accent-light mt-1">{github.contributions.currentStreak}d</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-subtle flex items-center gap-1">
                  <Award size={10} className="text-yellow-500" />
                  Longest
                </span>
                <span className="font-display text-2xl font-black text-accent-light mt-1">{github.contributions.longestStreak}d</span>
              </div>
            </div>
          </div>

          {/* Productivity & Weekly Trend Card */}
          <div className="rounded-2xl border border-white/[0.06] bg-surface/40 backdrop-blur-md p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h2 className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    Coding Productivity
                  </h2>
                  <p className="font-sans text-xs text-text-muted mt-0.5">Active times registered via WakaTime API.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-text-muted">
                  Stats
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle block">Tracked Coding (7D)</span>
                  <span className="font-display text-3xl font-black tracking-tighter text-accent-light block mt-1">{wakatime.totalHours} hrs</span>
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle block">Daily Average</span>
                  <span className="font-display text-3xl font-black tracking-tighter text-accent-light block mt-1">{wakatime.dailyAverage} hrs</span>
                </div>
              </div>
            </div>

            {/* Weekly Coding Trend Graph */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle block mb-2 flex items-center gap-1">
                <TrendingUp size={10} className="text-accent" />
                Weekly Coding Trend
              </span>
              <div className="flex items-end justify-between h-28 gap-2 px-1 pt-4 border-b border-white/5">
                {wakatime.weeklyTrend.map((t) => {
                  const maxHours = Math.max(...(wakatime.weeklyTrend.map(x => x.hours) || [6]));
                  const heightPercent = (t.hours / maxHours) * 85; // cap at 85% height to leave spacing for tooltip
                  return (
                    <div key={t.day} className="flex flex-col items-center flex-1 group gap-2">
                      <div className="relative w-full flex justify-center">
                        <span className="absolute -top-7 bg-accent text-bg font-mono text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md whitespace-nowrap">
                          {t.hours} hrs
                        </span>
                        <div
                          className="w-full bg-accent/15 group-hover:bg-accent rounded-t-[3px] transition-all duration-300 ease-out"
                          style={{ height: `${heightPercent || 10}%`, minHeight: '6px' }}
                        />
                      </div>
                      <span className="font-mono text-[9px] text-text-subtle group-hover:text-white transition">
                        {t.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 02: TECHNICAL ECOSYSTEM ────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-text-subtle">
          <span className="text-accent font-bold">02 /</span>
          <span>Technical Ecosystem</span>
          <div className="h-[1px] flex-1 bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1.1fr] gap-6">
          
          {/* Languages Breakdown */}
          <div className="rounded-2xl border border-white/[0.06] bg-surface/40 backdrop-blur-md p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h2 className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    Stack Distribution
                  </h2>
                  <p className="font-sans text-xs text-text-muted mt-0.5">Primary languages based on active file tracking.</p>
                </div>
                <Code2 size={16} className="text-accent opacity-80" />
              </div>

              {/* Language progress bars */}
              <div className="flex flex-col gap-4">
                {wakatime.languages.map((language) => (
                  <div key={language.name} className="group">
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                      <span className="text-accent-light group-hover:text-white transition">{language.name}</span>
                      <span className="text-text-subtle">{language.percent}% ({language.hours} hrs)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/30">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${getLanguageColor(language.name)}`}
                        style={{ width: `${language.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editors & OS workspace details */}
          <div className="rounded-2xl border border-white/[0.06] bg-surface/40 backdrop-blur-md p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h2 className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    Development Environment
                  </h2>
                  <p className="font-sans text-xs text-text-muted mt-0.5">Top-utilized workspace environments.</p>
                </div>
                <Layers size={16} className="text-accent opacity-80" />
              </div>

              {/* Grid for Editors & OS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-text-subtle mb-3.5 flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                    <Terminal size={11} className="text-accent" /> Editors
                  </h3>
                  <div className="flex flex-col gap-3">
                    {wakatime.editors.map((editor) => (
                      <div key={editor.name} className="flex flex-col gap-1 font-sans text-xs">
                        <div className="flex justify-between">
                          <span className="text-text-muted font-medium">{editor.name}</span>
                          <span className="font-mono text-accent-light">{editor.percent}%</span>
                        </div>
                        <div className="h-1 w-full bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-accent/70 rounded-full" style={{ width: `${editor.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-text-subtle mb-3.5 flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                    <Laptop size={11} className="text-accent" /> Systems
                  </h3>
                  <div className="flex flex-col gap-3">
                    {wakatime.operatingSystems.map((os) => (
                      <div key={os.name} className="flex flex-col gap-1 font-sans text-xs">
                        <div className="flex justify-between">
                          <span className="text-text-muted font-medium">{os.name}</span>
                          <span className="font-mono text-accent-light">{os.percent}%</span>
                        </div>
                        <div className="h-1 w-full bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-accent/70 rounded-full" style={{ width: `${os.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 rounded-lg border border-white/5 bg-white/[0.01] px-3.5 py-2.5 font-mono text-[9px] leading-relaxed text-text-subtle">
              System telemetry retrieved and aggregated per 24 hours.
            </p>
          </div>

        </div>
      </section>

      {/* ── SECTION 03: WEB AUDIT & TRAFFIC ────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-text-subtle">
          <span className="text-accent font-bold">03 /</span>
          <span>Web Audit & Traffic</span>
          <div className="h-[1px] flex-1 bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.3fr] gap-6">
          
          {/* Lighthouse Performance */}
          <div className="rounded-2xl border border-white/[0.06] bg-surface/40 backdrop-blur-md p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h2 className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    Lighthouse Performance
                  </h2>
                  <p className="font-sans text-xs text-text-muted mt-0.5">Audits executed via Google PageSpeed API.</p>
                </div>
                <Shield className="text-accent h-5 w-5 opacity-80" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <LighthouseCircle score={performance.performance} label="Perf" />
                <LighthouseCircle score={performance.accessibility} label="Access" />
                <LighthouseCircle score={performance.bestPractices} label="Rules" />
                <LighthouseCircle score={performance.seo} label="SEO" />
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/[0.03] bg-white/[0.01] px-4 py-3 flex items-start gap-3">
              <Zap className="text-emerald-500 h-5 w-5 shrink-0 opacity-80 mt-0.5" />
              <p className="font-sans text-[11px] leading-relaxed text-text-muted">
                Highly optimized asset delivery pipelines, responsive layouts, and proper document structures yield strong PageSpeed indices.
              </p>
            </div>
          </div>

          {/* Umami Traffic Card */}
          <div className="rounded-2xl border border-white/[0.06] bg-surface/40 backdrop-blur-md p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h2 className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    Traffic & Analytics
                  </h2>
                  <p className="font-sans text-xs text-text-muted mt-0.5">Audience overview in the last 30 days.</p>
                </div>
                <Globe size={16} className="text-accent opacity-80" />
              </div>

              {/* 4 Analytics KPI items */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <CompactMetric label="Views" value={umami.pageviews} />
                <CompactMetric label="Visitors" value={umami.visitors} />
                <CompactMetric label="Visits" value={umami.visits} />
                <CompactMetric label="Bounce" value={`${umami.bounceRate}%`} />
              </div>

              {/* Top Pages Table */}
              <div className="border-t border-white/5 pt-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle block mb-3 font-semibold">Top Visited Pages</span>
                <div className="flex flex-col gap-2.5">
                  {umami.topPages.map((page) => (
                    <div key={page.path} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-mono text-text-muted font-medium">{page.path}</span>
                        <div className="flex items-center gap-2.5">
                          <span className="text-text-subtle font-mono text-[10px]">{page.views} views</span>
                          <span className="font-mono text-accent-light text-[9px] bg-white/5 px-1.5 py-0.5 rounded">
                            {page.percent}%
                          </span>
                        </div>
                      </div>
                      <div className="h-[2px] w-full bg-white/[0.03] rounded-full overflow-hidden">
                        <div className="h-full bg-accent/60" style={{ width: `${page.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {!umami.configured && (
              <p className="mt-5 rounded-lg border border-white/5 bg-white/5 px-4 py-2.5 font-sans text-[9px] leading-relaxed text-text-muted">
                Umami stats loaded as static insights. Add configuration keys to establish live server query.
              </p>
            )}
          </div>

        </div>
      </section>

      {/* ── SECTION 04: SOURCE FEED ────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-text-subtle">
          <span className="text-accent font-bold">04 /</span>
          <span>Source Feed</span>
          <div className="h-[1px] flex-1 bg-white/[0.06]" />
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-surface/40 backdrop-blur-md p-6 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Recent Repositories
              </h2>
              <p className="font-sans text-xs text-text-muted mt-0.5">Latest updated public codebases on GitHub.</p>
            </div>
            <Zap className="text-accent h-5 w-5 opacity-80 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {github.repositories.latest.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-300 hover:border-accent/30 hover:bg-surface/50"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-display text-sm font-bold text-accent-light group-hover:text-accent transition truncate">
                    {repo.name}
                  </span>
                  <span className="font-mono text-[9px] text-text-subtle">
                    Updated: {new Date(repo.updatedAt).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {repo.language && (
                    <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[9px] text-text-muted">
                      {repo.language}
                    </span>
                  )}
                  <ArrowUpRight size={13} className="text-text-subtle group-hover:text-white transition" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CREDIT ─────────────────────────────────────────────────── */}
      <footer className="mt-8 border-t border-white/5 pt-5 pb-2 text-center flex items-center justify-center gap-1.5 font-mono text-[10px] text-text-subtle">
        <span>Designed & Crafted with</span>
        <Heart size={10} className="text-accent fill-accent animate-pulse" />
        <span>by Rislan Tristansyah © 2026</span>
      </footer>

    </div>
  );
}
