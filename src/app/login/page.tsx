"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClientOnlyCustomCursor from "@/components/ClientOnlyCustomCursor";

function LoginForm() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();
      if (data.success) {
        const redirect = searchParams.get("redirect") || "/admin";
        router.push(redirect);
      } else {
        setError(data.error || "Invalid secret key");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="key" className="font-mono text-[10px] uppercase tracking-widest text-text-subtle">
          Secret Passcode
        </label>
        <input
          id="key"
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="••••••••••••"
          required
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-sans text-sm tracking-wide text-text placeholder-white/20 outline-none transition-all focus:border-accent/50 focus:bg-white/10"
        />
      </div>

      {error && (
        <p className="font-sans text-xs font-medium text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-lg bg-accent px-5 py-3 font-display text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-accent-light disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Unlock Access"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <>
      <ClientOnlyCustomCursor />
      <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-text">
        <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-black/40 p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">
              Restricted Area
            </span>
            <h1 className="mt-3 font-display text-4xl font-black leading-none tracking-tight">
              Admin <span className="text-accent-light italic">Access</span>
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Please enter your secret access key to continue.
            </p>
          </div>

          <Suspense fallback={
            <div className="mt-8 flex justify-center py-6">
              <span className="font-mono text-xs text-text-muted animate-pulse">Loading secure session...</span>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </>
  );
}
