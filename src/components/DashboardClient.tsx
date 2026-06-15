"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-surface p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
        {label}
      </p>
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

  const { github, umami } = data;

  return (
    <main className="min-h-screen bg-bg px-6 py-8 text-text md:px-12 lg:px-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col justify-between gap-6 border-b border-white/5 pb-8 lg:flex-row lg:items-end">
          <div className="flex max-w-4xl flex-col gap-4">
            <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-widest text-accent">
              <span className="h-[1px] w-8 bg-accent" />
              Dashboard
            </div>
            <h1 className="font-display text-5xl font-black leading-none tracking-tighter md:text-7xl">
              Personal <span className="text-accent-light italic">Stats</span>
            </h1>
            <p className="max-w-2xl font-sans text-sm leading-relaxed text-text-muted md:text-base">
              A focused dashboard for GitHub contribution performance, frequently used tech,
              repository activity, and website analytics from Umami.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="btn-secondary-magnetic px-5 py-3 font-display text-xs font-semibold uppercase tracking-wider"
            >
              Portfolio
            </Link>
            <Link
              href="/forum"
              className="btn-secondary-magnetic px-5 py-3 font-display text-xs font-semibold uppercase tracking-wider"
            >
              Forum
            </Link>
            <a
              href={github.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-magnetic flex items-center gap-2 px-5 py-3 font-display text-xs font-semibold uppercase tracking-wider"
            >
              <GitHubMark />
              GitHub
            </a>
          </div>
        </header>

        {loading && (
          <div className="rounded-lg border border-accent/15 bg-accent/5 px-4 py-3 font-sans text-sm text-accent-light">
            Loading live statistics...
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Contributions"
            value={github.contributions.total}
            detail="All public contribution activity found in the yearly calendar."
          />
          <StatCard
            label="This Week"
            value={github.contributions.thisWeek}
            detail="Contribution total across the last seven calendar days."
          />
          <StatCard
            label="Best Day"
            value={github.contributions.best}
            detail="Highest single-day public contribution count."
          />
          <StatCard
            label="Daily Average"
            value={github.contributions.average}
            detail="Average contributions per day across the loaded year."
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="rounded-lg border border-white/5 bg-surface p-5 md:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-text">
                  Contribution Rhythm
                </h2>
                <p className="mt-1 font-sans text-xs text-text-muted">
                  Public GitHub activity for @{github.username}.
                </p>
              </div>
              <span className="w-fit rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                Live GitHub
              </span>
            </div>

            {github.contributions.available ? (
              <MiniHeatmap days={github.contributions.days} />
            ) : (
              <div className="rounded-lg border border-white/5 bg-bg-elevated p-4">
                <Image
                  src={github.chartUrl}
                  alt={`${github.username} GitHub contribution graph`}
                  width={760}
                  height={120}
                  className="min-h-[120px] w-[760px] max-w-none opacity-95 md:w-full"
                />
              </div>
            )}
          </div>

          <div className="rounded-lg border border-white/5 bg-surface p-5 md:p-6">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-text">
              Repository Snapshot
            </h2>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <CompactMetric label="Repos" value={github.repositories.total} />
              <CompactMetric label="Stars" value={github.repositories.stars} />
              <CompactMetric label="Forks" value={github.repositories.forks} />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.1fr]">
          <div className="rounded-lg border border-white/5 bg-surface p-5 md:p-6">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-text">
              Tech Usage
            </h2>
            <p className="mt-1 font-sans text-xs text-text-muted">
              Languages detected from public repositories.
            </p>
            <div className="mt-6 flex flex-col gap-4">
              {github.languages.length > 0 ? (
                github.languages.map((language) => (
                  <div key={language.name}>
                    <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
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
              ) : (
                <p className="font-sans text-sm text-text-muted">
                  Language stats will appear when GitHub data is available.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-surface p-5 md:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-text">
                  Umami Analytics
                </h2>
                <p className="mt-1 font-sans text-xs text-text-muted">
                  Website performance over the last 30 days.
                </p>
              </div>
              <span className="w-fit rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                {umami.available ? "Connected" : "Not Connected"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <CompactMetric label="Views" value={umami.pageviews} />
              <CompactMetric label="Visitors" value={umami.visitors} />
              <CompactMetric label="Visits" value={umami.visits} />
              <CompactMetric label="Bounce" value={`${umami.bounceRate}%`} />
            </div>

            {!umami.configured && (
              <p className="mt-5 rounded-lg border border-accent/20 bg-accent/10 px-4 py-3 font-sans text-xs leading-relaxed text-accent-light">
                Add UMAMI_API_URL, UMAMI_WEBSITE_ID, and UMAMI_API_KEY to .env.local
                to connect live analytics.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-white/5 bg-surface p-5 md:p-6">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-text">
            Recent Repository Activity
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            {github.repositories.latest.length > 0 ? (
              github.repositories.latest.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/5 bg-bg-elevated p-4 transition-colors hover:border-accent/35"
                >
                  <p className="truncate font-display text-sm font-bold text-accent-light">
                    {repo.name}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
                    {repo.language || "Code"}
                  </p>
                </a>
              ))
            ) : (
              <p className="font-sans text-sm text-text-muted">
                Recent repository data is not available yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
