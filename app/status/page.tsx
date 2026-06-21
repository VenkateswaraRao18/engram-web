"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

const BASE = "https://engram-api-venky.fly.dev";
const API_KEY = process.env.NEXT_PUBLIC_STATUS_KEY ?? "";

interface Check {
  name: string;
  endpoint: string;
  status: "checking" | "up" | "degraded" | "down";
  latency: number | null;
}

const CHECKS_INIT: Check[] = [
  { name: "Memory API",       endpoint: `${BASE}/v1/users/status-check/stats`, status: "checking", latency: null },
  { name: "Search endpoint",  endpoint: `${BASE}/v1/memories/search?query=test&user_id=status-check&k=1`, status: "checking", latency: null },
  { name: "Context endpoint", endpoint: `${BASE}/v1/memories/context?query=test&user_id=status-check`, status: "checking", latency: null },
];

export default function StatusPage() {
  const [checks, setChecks] = useState<Check[]>(CHECKS_INIT);
  const [lastChecked, setLastChecked] = useState<string>("");

  async function runChecks() {
    setChecks(CHECKS_INIT.map(c => ({ ...c, status: "checking" })));
    const results = await Promise.all(
      CHECKS_INIT.map(async (c) => {
        const t0 = Date.now();
        try {
          const r = await fetch(c.endpoint, {
            headers: { "X-API-Key": API_KEY || "engrm_Q9bWNE_EwLU0-SURhIPQ84fbJJ51GLtNBXS9-wpsewc" },
          });
          const latency = Date.now() - t0;
          return {
            ...c,
            status: r.ok ? (latency > 3000 ? "degraded" : "up") : "down",
            latency,
          } as Check;
        } catch {
          return { ...c, status: "down" as const, latency: Date.now() - t0 };
        }
      })
    );
    setChecks(results);
    setLastChecked(new Date().toLocaleTimeString());
  }

  useEffect(() => { runChecks(); }, []);

  const allUp = checks.every(c => c.status === "up");
  const anyDown = checks.some(c => c.status === "down");
  const overall = anyDown ? "Partial outage" : allUp ? "All systems operational" : "Checking…";
  const overallColor = anyDown ? "#ef4444" : allUp ? "#34d399" : "#f59e0b";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 18px rgba(124,58,237,.45)" }}>E</div>
            <span className="font-bold tracking-tight">Engram</span>
          </Link>
          <Link href="/" className="text-sm transition-colors hover:text-white" style={{ color: "var(--muted-b)" }}>
            ← Back to home
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-32 pb-24">

        {/* Overall status */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-6"
            style={{ background: anyDown ? "rgba(239,68,68,.1)" : "rgba(52,211,153,.1)", border: `1px solid ${anyDown ? "rgba(239,68,68,.2)" : "rgba(52,211,153,.2)"}` }}
          >
            <span className="w-3 h-3 rounded-full shrink-0 anim-pulse-dot" style={{ background: overallColor }} />
            <span className="text-base font-bold" style={{ color: overallColor }}>{overall}</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ letterSpacing: "-0.03em" }}>Engram Status</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Live checks against the production API · {lastChecked ? `Last checked: ${lastChecked}` : "Checking now…"}
          </p>
        </div>

        {/* Individual checks */}
        <div className="space-y-3 mb-10">
          {checks.map((c) => {
            const color = c.status === "up" ? "#34d399" : c.status === "down" ? "#ef4444" : c.status === "degraded" ? "#f59e0b" : "var(--muted)";
            const label = c.status === "checking" ? "Checking…" : c.status === "up" ? "Operational" : c.status === "degraded" ? "Degraded" : "Down";
            return (
              <div key={c.name}
                className="flex items-center justify-between px-6 py-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,.035)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{c.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  {c.latency !== null && (
                    <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>{c.latency}ms</span>
                  )}
                  <span className="text-xs font-semibold" style={{ color }}>{label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Refresh button */}
        <div className="text-center">
          <button
            onClick={runChecks}
            className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold"
          >
            Refresh
          </button>
        </div>

      </main>
    </div>
  );
}
