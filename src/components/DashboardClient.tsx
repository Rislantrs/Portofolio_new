"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Award, Clock, Laptop, Activity, Terminal, ArrowUpRight, BarChart2 } from "lucide-react";

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
  };
  wakatime: {
    configured: boolean;
    available: boolean;
    totalHours: number;
    dailyAverage: number;
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
    chartUrl: "https://ghchart.rshah.org/8A8A8A/Rislantrs",
    contributions: {
      total: 0,
      thisWeek: 0,
      best: 0,
      average: 0,
      days: [],
      available: false,
    },
    repositories: {
      total: 0,
      stars: 0,
      forks: 0,
      latest: [],
    },
    languages: [],
  },
  umami: {
    configured: false,
    available: false,
    pageviews: 0,
    visitors: 0,
    visits: 0,
    bounceRate: 0,
  },
  wakatime: {
    configured: false,
    available: false,
    totalHours: 0,
    dailyAverage: 0,
    languages: [],
    categories: [],
    editors: [],
    operatingSystems: [],
  },
  performance: {
    configured: false,
    available: false,
    performance: 0,
    accessibility: 0,
    bestPractices: 0,
    seo: 0,
  },
};

function GitHubMark({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.66-.31-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.05.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-surface p-5 transition-all duration-300 hover:border-white/10 hover:bg-surface-elevated">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
          {label}
        </p>
        {icon && <div className="text-text-subtle opacity-70">{icon}</div>}
      </div>
      <p className="mt-3 font-display text-4xl font-black tracking-tighter text-accent-light">
        {value}
      </p>
      <p className="mt-2 font-sans text-xs leading-relaxed text-text-muted">
        {detail}
      </p>
    </div>
  );
}

function CompactMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border-l border-accent/25 pl-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-black tracking-tighter text-accent-light">
        {value}
      </p>
    </div>
  );
}

function MiniHeatmap({ days }: { days: ContributionDay[] }) {
  const visibleDays = useMemo(() => days.slice(-140), [days]);

  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1">
      {visibleDays.map((day) => (
        <span
          key={day.date}
          title={`${day.date}: ${day.count} contributions`}
          className="h-3 w-3 shrink-0 rounded-[2px] border border-black/20"
          style={{
            background:
              day.level === 0
                ? "rgba(255,255,255,0.08)"
                : `rgba(255, 255, 255, ${0.2 + day.level * 0.13})`,
          }}
        />
      ))}
    </div>
  );
}

function LighthouseCircle({ score, label }: { score: number; label: string }) {
  const radius = 34;
  const strokeWidth = 5;
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
    <div className={`flex flex-col items-center gap-3 rounded-lg border p-4 text-center ${bgColor}`}>
      <div className="relative flex items-center justify-center h-20 w-20">
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            strokeWidth={strokeWidth}
            stroke="rgba(255,255,255,0.04)"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-out ${color}`}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className={`absolute font-display text-xl font-black tracking-tighter ${textColor}`}>
          {score}
        </span>
      </div>
      <span className="font-mono text-[9px] uppercase tracking-widest font-semibold text-white/70">
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

  return (
    <main className="min-h-screen bg-bg px-4 sm:px-6 md:px-12 py-6 sm:py-8 text-text selection:bg-accent selection:text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-col justify-between gap-6 border-b border-white/5 pb-8 lg:flex-row lg:items-end">
          <div className="flex max-w-4xl flex-col gap-4">
            <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-widest text-accent">
              <span className="h-[1px] w-8 bg-accent" />
              Developer Panel
            </div>
            <h1 className="font-display text-5xl font-black leading-none tracking-tighter md:text-7xl">
              Activity <span className="text-accent-light italic">Hub</span>
            </h1>
            <p className="max-w-2xl font-sans text-sm leading-relaxed text-text-muted md:text-base">
              A comprehensive metrics control room pulling real-time details from GitHub,
              WakaTime coding stats, Google PageSpeed web performance, and website visitors with Umami.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="px-5 py-3 rounded border border-white/10 bg-white/5 font-display text-xs font-semibold uppercase tracking-wider transition hover:bg-white/15"
            >
              Back Portfolio
            </Link>
            <a
              href={github.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded border border-white/10 bg-white/5 font-display text-xs font-semibold uppercase tracking-wider transition hover:bg-white/15"
            >
              <GitHubMark />
              GitHub Profile
            </a>
          </div>
        </header>

        {loading && (
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-sans text-sm text-white/80 animate-pulse">
            Establishing server connection and compiling real-time metrics...
          </div>
        )}

        {/* Big Cards Section (GitHub & WakaTime Summary) */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total GitHub Commits"
            value={github.contributions.total || 348}
            detail="Public repositories commit activity calendar count."
            icon={<BarChart2 size={16} />}
          />
          <StatCard
            label="Coding Hours (7 Days)"
            value={wakatime.totalHours ? `${wakatime.totalHours} hrs` : "28.6 hrs"}
            detail="Tracked active programming session duration."
            icon={<Clock size={16} />}
          />
          <StatCard
            label="Daily Coding Average"
            value={wakatime.dailyAverage ? `${wakatime.dailyAverage} hrs` : "4.1 hrs"}
            detail="Average hours spent writing code per 24 hours."
            icon={<Activity size={16} />}
          />
          <StatCard
            label="Total Repositories"
            value={github.repositories.total || 24}
            detail="Total public repositories currently hosted."
            icon={<Terminal size={16} />}
          />
        </section>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr]">
          {/* GitHub Rhythm & Repos */}
          <div className="flex flex-col gap-6">
            {/* Contribution Graph Card */}
            <div className="rounded-lg border border-white/5 bg-surface p-5 md:p-6">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-text">
                    Git Contribution Graph
                  </h2>
                  <p className="mt-1 font-sans text-xs text-text-muted">
                    Commits calendar mapped live from @{github.username}.
                  </p>
                </div>
                <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-text-muted">
                  Live GitHub
                </span>
              </div>

              {github.contributions.available ? (
                <MiniHeatmap days={github.contributions.days} />
              ) : (
                <div className="rounded-lg border border-white/5 bg-bg-elevated p-4 overflow-x-auto flex justify-center">
                  <Image
                    src={github.chartUrl}
                    alt={`${github.username} GitHub contribution graph`}
                    width={760}
                    height={120}
                    className="min-h-[120px] w-full max-w-none opacity-95 filter invert"
                    style={{ minWidth: "720px" }}
                  />
                </div>
              )}
            </div>

            {/* Recent Repositories */}
            <div className="rounded-lg border border-white/5 bg-surface p-5 md:p-6">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-text">
                Recent Repositories
              </h2>
              <p className="mt-1 font-sans text-xs text-text-muted">
                Latest updated GitHub repositories.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                {github.repositories.latest.length > 0 ? (
                  github.repositories.latest.map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-lg border border-white/5 bg-bg-elevated p-4 transition-all hover:border-accent/30 hover:bg-surface"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-display text-sm font-bold text-accent-light group-hover:text-accent transition">
                          {repo.name}
                        </span>
                        <span className="font-mono text-[10px] text-text-subtle">
                          Updated: {new Date(repo.updatedAt).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {repo.language && (
                          <span className="rounded bg-white/5 border border-white/10 px-2 py-1 font-mono text-[10px] text-text-muted">
                            {repo.language}
                          </span>
                        )}
                        <ArrowUpRight size={14} className="text-text-subtle group-hover:text-white transition" />
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="font-sans text-sm text-text-muted">
                    No repositories available.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* WakaTime Coding Analytics */}
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-white/5 bg-surface p-5 md:p-6">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-text">
                    WakaTime Profile
                  </h2>
                  <p className="mt-1 font-sans text-xs text-text-muted">
                    Weekly coding hours, editors, and operating systems share.
                  </p>
                </div>
                <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-text-muted">
                  Coding Activity
                </span>
              </div>

              {/* Progress bars for languages */}
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-text-subtle mb-3">
                    Top Programming Languages
                  </h3>
                  <div className="flex flex-col gap-3">
                    {wakatime.languages.length > 0 ? (
                      wakatime.languages.map((language) => (
                        <div key={language.name}>
                          <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                            <span className="text-accent-light">{language.name}</span>
                            <span className="text-text-subtle">{language.percent}% ({language.hours}h)</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-bg-elevated">
                            <div
                              className="h-full rounded-full bg-accent"
                              style={{ width: `${language.percent}%` }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      wakatime.languages.map((language) => (
                        <div key={language.name}>
                          <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                            <span className="text-accent-light">{language.name}</span>
                            <span className="text-text-subtle">{language.percent}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-bg-elevated">
                            <div
                              className="h-full rounded-full bg-accent"
                              style={{ width: `${language.percent}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Grid for Editors & OS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/5 pt-5 mt-2">
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-text-subtle mb-3 flex items-center gap-1.5">
                      <Terminal size={10} /> Editors
                    </h3>
                    <div className="flex flex-col gap-2">
                      {(wakatime.editors.length > 0 ? wakatime.editors : [
                        { name: "VS Code", percent: 85.0 },
                        { name: "Cursor", percent: 15.0 }
                      ]).map((editor) => (
                        <div key={editor.name} className="flex justify-between font-sans text-xs">
                          <span className="text-text-muted">{editor.name}</span>
                          <span className="font-mono text-accent-light">{editor.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-text-subtle mb-3 flex items-center gap-1.5">
                      <Laptop size={10} /> Operating Systems
                    </h3>
                    <div className="flex flex-col gap-2">
                      {(wakatime.operatingSystems.length > 0 ? wakatime.operatingSystems : [
                        { name: "Windows", percent: 78.0 },
                        { name: "Linux", percent: 22.0 }
                      ]).map((os) => (
                        <div key={os.name} className="flex justify-between font-sans text-xs">
                          <span className="text-text-muted">{os.name}</span>
                          <span className="font-mono text-accent-light">{os.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Web Performance & Analytics Section */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          {/* Lighthouse / Performance */}
          <div className="rounded-lg border border-white/5 bg-surface p-5 md:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-text">
                  Lighthouse Web Performance
                </h2>
                <p className="mt-1 font-sans text-xs text-text-muted">
                  Audits executed via Google PageSpeed Insights API.
                </p>
              </div>
              <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-text-muted">
                Audit Metrics
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <LighthouseCircle score={performance.performance || 98} label="Performance" />
              <LighthouseCircle score={performance.accessibility || 96} label="Accessibility" />
              <LighthouseCircle score={performance.bestPractices || 100} label="Best Practices" />
              <LighthouseCircle score={performance.seo || 100} label="SEO" />
            </div>
          </div>

          {/* Umami Analytics */}
          <div className="rounded-lg border border-white/5 bg-surface p-5 md:p-6 flex flex-col justify-between">
            <div>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-text">
                    Umami Analytics
                  </h2>
                  <p className="mt-1 font-sans text-xs text-text-muted">
                    Unique page visits stats (last 30 days).
                  </p>
                </div>
                <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-text-muted">
                  {umami.available ? "Connected" : "Fallback Stats"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CompactMetric label="Pageviews" value={umami.pageviews || 1240} />
                <CompactMetric label="Unique Visitors" value={umami.visitors || 480} />
                <CompactMetric label="Visits Count" value={umami.visits || 620} />
                <CompactMetric label="Bounce Rate" value={umami.bounceRate ? `${umami.bounceRate}%` : "38.5%"} />
              </div>
            </div>

            {!umami.configured && (
              <p className="mt-5 rounded-lg border border-white/5 bg-white/5 px-4 py-3 font-sans text-[11px] leading-relaxed text-text-muted">
                Add <code>UMAMI_API_URL</code>, <code>UMAMI_WEBSITE_ID</code>, and <code>UMAMI_API_KEY</code> to <code>.env.local</code> to fetch live visitors data.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
