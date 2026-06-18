"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface KeyRecord {
  api_key: string;
  total_calls: number;
  created_at: string;
}

/* ── Inline SVG icons ────────────────────────────────────── */
function IGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="5" height="5" rx="1.2"/>
      <rect x="10" y="1" width="5" height="5" rx="1.2"/>
      <rect x="1" y="10" width="5" height="5" rx="1.2"/>
      <rect x="10" y="10" width="5" height="5" rx="1.2"/>
    </svg>
  );
}
function IKey() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="15" r="5"/><path d="M12 11l9-9"/><path d="M21 2v4"/><path d="M17 6h4"/>
    </svg>
  );
}
function IChart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 20h18"/><rect x="5" y="12" width="3" height="8" rx="1"/>
      <rect x="10.5" y="7" width="3" height="13" rx="1"/><rect x="16" y="3" width="3" height="17" rx="1"/>
    </svg>
  );
}
function IBook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  );
}
function IEye() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function IEyeOff() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
function ICopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  );
}
function IExternal() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}
function ICheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

/* ── Code content ─────────────────────────────────────────── */
const CODE_TABS = ["Python", "JavaScript", "cURL"];

function getCode(tab: string, apiKey: string) {
  const k = apiKey || "engrm_your_api_key";
  const b = "https://engram-api-venky.fly.dev";

  if (tab === "Python") return `import requests

KEY  = "${k}"
BASE = "${b}"

# Store memories
requests.post(f"{BASE}/v1/memories",
  headers={"X-API-Key": KEY},
  json={
    "messages": [
      {"role":"user","content":"I moved from Tampa to Austin"}
    ],
    "user_id": "user-123"
  }
)

# Get LLM-ready context
ctx = requests.get(
  f"{BASE}/v1/memories/context",
  headers={"X-API-Key": KEY},
  params={"query":"where does user live","user_id":"user-123"}
).json()["context"]

# [semantic] User lives in Austin, TX  ← Tampa invalidated`;

  if (tab === "JavaScript") return `const KEY  = "${k}";
const BASE = "${b}";

// Store memories
await fetch(\`\${BASE}/v1/memories\`, {
  method: "POST",
  headers: { "X-API-Key": KEY, "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "I moved to Austin" }],
    user_id: "user-123"
  })
});

// Get context
const { context } = await fetch(
  \`\${BASE}/v1/memories/context?query=where+does+user+live&user_id=user-123\`,
  { headers: { "X-API-Key": KEY } }
).then(r => r.json());

// [semantic] User lives in Austin, TX`;

  return `# Store memories
curl -X POST ${b}/v1/memories \\
  -H "X-API-Key: ${k}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      {"role":"user","content":"I moved to Austin"}
    ],
    "user_id": "user-123"
  }'

# Get context
curl "${b}/v1/memories/context?query=where+does+user+live&user_id=user-123" \\
  -H "X-API-Key: ${k}"`;
}

const ENDPOINTS = [
  { method: "POST", path: "/v1/memories", desc: "Store memories from a conversation" },
  { method: "GET",  path: "/v1/memories/search", desc: "Semantic + graph search" },
  { method: "GET",  path: "/v1/memories/context", desc: "Get LLM-ready context string" },
  { method: "GET",  path: "/v1/memories/about/{person}", desc: "Retrieve third-party facts" },
  { method: "GET",  path: "/v1/users/{id}/export", desc: "GDPR data export" },
  { method: "POST", path: "/v1/users/{id}/compress", desc: "Compress old memories" },
];

/* ── Dashboard ───────────────────────────────────────────── */
export default function Dashboard() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [keyRecord, setKeyRecord] = useState<KeyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState("Python");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }
      setUser({ email: user.email! });
      const { data } = await supabase
        .from("api_keys")
        .select("api_key, total_calls, created_at")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setKeyRecord(data);
      } else {
        const res = await fetch("/api/provision-key", { method: "POST" });
        const d = await res.json();
        if (res.ok) setKeyRecord(d);
      }
      setLoading(false);
    }
    load();
  }, []);

  function copyKey() {
    if (!keyRecord) return;
    navigator.clipboard.writeText(keyRecord.api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const totalCalls = keyRecord?.total_calls ?? 0;
  const limit = 10000;
  const pct = Math.min((totalCalls / limit) * 100, 100);
  const masked = keyRecord
    ? keyRecord.api_key.slice(0, 14) + "•".repeat(18)
    : "Provisioning...";

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
        {/* Sidebar skeleton */}
        <aside
          className="w-60 shrink-0 border-r p-5 hidden md:flex flex-col"
          style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}
        >
          <div className="skeleton h-7 w-28 mb-8" />
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-10 mb-2.5" />)}
        </aside>

        <main className="flex-1 p-8">
          <div className="skeleton h-7 w-36 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28" />)}
          </div>
          <div className="skeleton h-20 mb-5" />
          <div className="skeleton h-36 mb-5" />
          <div className="skeleton h-72" />
        </main>
      </div>
    );
  }

  const NAV_ITEMS = [
    { icon: <IGrid />, label: "Overview", href: "/dashboard", active: true },
    { icon: <IKey />, label: "API Keys", href: "/dashboard", active: false },
    { icon: <IChart />, label: "Usage", href: "/dashboard", active: false },
    { icon: <IBook />, label: "Docs", href: "/docs", active: false },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>

      {/* ── Sidebar ── */}
      <aside
        className="w-60 shrink-0 border-r hidden md:flex flex-col p-4"
        style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-8 px-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: "var(--accent)" }}
          >E</div>
          <span className="font-bold text-sm" style={{ color: "var(--text)" }}>Engram</span>
        </Link>

        <nav className="flex-1 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`sidebar-item ${item.active ? "active" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Plan card */}
        <div className="mt-auto pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <div
            className="rounded-xl p-4"
            style={{ background: "var(--accent-pale)", border: "1px solid rgba(79,70,229,.15)" }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>Free Plan</span>
              <span className="badge badge-accent text-[10px] py-0.5">Active</span>
            </div>
            <div className="text-xs mb-3" style={{ color: "var(--muted-b)" }}>
              <span className="font-semibold" style={{ color: "var(--text)" }}>
                {(limit - totalCalls).toLocaleString()}
              </span>{" "}
              calls remaining
            </div>
            <Link
              href="#"
              className="block text-center text-xs font-semibold py-2 rounded-lg text-white transition-colors"
              style={{ background: "var(--accent)" }}
            >
              Upgrade to Pro →
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Top bar */}
        <header
          className="h-14 flex items-center justify-between px-6 border-b shrink-0 sticky top-0 z-10"
          style={{ background: "rgba(255,255,255,.9)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: "var(--muted)" }}>Dashboard</span>
            <span style={{ color: "var(--border-b)" }}>/</span>
            <span className="font-medium" style={{ color: "var(--text)" }}>Overview</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block" style={{ color: "var(--muted-b)" }}>
              {user?.email}
            </span>
            <button
              onClick={signOut}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
              style={{
                color: "var(--muted-b)",
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-b)";
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--muted-b)";
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 p-7 max-w-5xl w-full">

          {/* Page heading */}
          <div className="mb-8 anim-fade-in">
            <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
              Overview
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Welcome back,{" "}
              <span className="font-medium" style={{ color: "var(--text-2)" }}>
                {user?.email?.split("@")[0]}
              </span>
            </p>
          </div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 anim-fade-up anim-d1">
            {[
              {
                label: "API Calls",
                value: totalCalls.toLocaleString(),
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                ),
                color: "var(--accent)",
                bg: "var(--accent-pale)",
              },
              {
                label: "Current Plan",
                value: "Free",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ),
                color: "var(--yellow)",
                bg: "var(--yellow-pale)",
              },
              {
                label: "Calls Remaining",
                value: (limit - totalCalls).toLocaleString(),
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                ),
                color: "var(--green)",
                bg: "var(--green-pale)",
              },
              {
                label: "Memories Stored",
                value: "—",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3"/>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                  </svg>
                ),
                color: "var(--blue)",
                bg: "var(--blue-pale)",
              },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <div className="text-2xl font-bold mb-0.5" style={{ color: "var(--text)" }}>
                  {s.value}
                </div>
                <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Usage bar ── */}
          <div
            className="card-flat p-5 mb-5 anim-fade-up anim-d2"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Monthly Usage
                </span>
                <span className="ml-2 text-xs" style={{ color: "var(--muted)" }}>
                  Free plan · resets monthly
                </span>
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: pct > 80 ? "var(--red)" : "var(--text-2)" }}
              >
                {totalCalls.toLocaleString()} / {limit.toLocaleString()}
              </span>
            </div>

            {/* Track */}
            <div
              className="h-2.5 rounded-full overflow-hidden"
              style={{ background: "var(--bg-section)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background:
                    pct > 80
                      ? "linear-gradient(to right, #dc2626, #ef4444)"
                      : "linear-gradient(to right, #4f46e5, #6366f1)",
                }}
              />
            </div>

            {pct > 70 && (
              <p className="text-xs mt-2.5 font-medium" style={{ color: "var(--yellow)" }}>
                ⚠ You&apos;re at {pct.toFixed(0)}% of your quota.{" "}
                <Link href="/auth" className="underline" style={{ color: "var(--accent)" }}>
                  Upgrade to Pro
                </Link>
              </p>
            )}
          </div>

          {/* ── API Key ── */}
          <div className="card-flat p-5 mb-5 anim-fade-up anim-d3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>
                  API Key
                </h2>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Include as{" "}
                  <code
                    className="px-1.5 py-0.5 rounded text-[11px]"
                    style={{
                      background: "var(--bg-section)",
                      color: "var(--accent)",
                      fontFamily: "var(--font-geist-mono)",
                    }}
                  >
                    X-API-Key
                  </code>{" "}
                  in every request.
                </p>
              </div>
              <span className="badge badge-green text-xs">Active</span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="flex-1 flex items-center px-4 py-3 rounded-xl"
                style={{ background: "var(--bg-section)", border: "1px solid var(--border)" }}
              >
                <code
                  className="flex-1 text-sm truncate"
                  style={{
                    color: "var(--text)",
                    fontFamily: "var(--font-geist-mono)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {showKey ? (keyRecord?.api_key ?? "Provisioning...") : masked}
                </code>
              </div>

              <button
                onClick={() => setShowKey((v) => !v)}
                title={showKey ? "Hide" : "Show"}
                className="p-3 rounded-xl transition-colors"
                style={{
                  background: "var(--bg-section)",
                  border: "1px solid var(--border)",
                  color: "var(--muted-b)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-b)";
                  e.currentTarget.style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--muted-b)";
                }}
              >
                {showKey ? <IEyeOff /> : <IEye />}
              </button>

              <button
                onClick={copyKey}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: copied ? "var(--green-pale)" : "var(--bg-section)",
                  border: `1px solid ${copied ? "rgba(5,150,105,.25)" : "var(--border)"}`,
                  color: copied ? "var(--green)" : "var(--muted-b)",
                }}
              >
                {copied ? <ICheck /> : <ICopy />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* ── Quick Start ── */}
          <div
            className="rounded-2xl overflow-hidden mb-5 anim-fade-up anim-d4"
            style={{ border: "1px solid var(--border)", boxShadow: "var(--sh-xs)" }}
          >
            <div
              className="flex items-center justify-between px-5 py-3.5 border-b"
              style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
            >
              <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Quick Start</h2>
              <div className="flex gap-1">
                {CODE_TABS.map((tab) => (
                  <button
                    key={tab}
                    className={`tab ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="code-block" style={{ borderRadius: 0, border: "none" }}>
              <div className="code-block-header">
                <div className="dot dot-r" /><div className="dot dot-y" /><div className="dot dot-g" />
                <span
                  className="ml-3 text-xs"
                  style={{ color: "rgba(255,255,255,.3)", fontFamily: "var(--font-geist-mono)" }}
                >
                  {activeTab === "Python" ? "example.py" : activeTab === "JavaScript" ? "example.js" : "terminal"}
                </span>
              </div>
              <pre
                className="p-5 text-sm leading-relaxed overflow-x-auto"
                style={{
                  color: "#c4b5fd",
                  fontFamily: "var(--font-geist-mono)",
                  maxHeight: 340,
                  tabSize: 2,
                }}
              >
                {getCode(activeTab, keyRecord?.api_key ?? "")}
              </pre>
            </div>
          </div>

          {/* ── Endpoints ── */}
          <div
            className="card-flat p-5 anim-fade-up anim-d5"
          >
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
              API Endpoints
            </h2>
            <div className="space-y-2">
              {ENDPOINTS.map((ep) => (
                <div
                  key={ep.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm group transition-colors"
                  style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(79,70,229,.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-lg shrink-0"
                    style={{
                      background: ep.method === "POST" ? "var(--accent-pale)" : "var(--blue-pale)",
                      color: ep.method === "POST" ? "var(--accent)" : "var(--blue)",
                      fontFamily: "var(--font-geist-mono)",
                      minWidth: 42,
                      textAlign: "center",
                    }}
                  >
                    {ep.method}
                  </span>
                  <code
                    className="text-xs shrink-0"
                    style={{ color: "var(--text)", fontFamily: "var(--font-geist-mono)" }}
                  >
                    {ep.path}
                  </code>
                  <span
                    className="text-xs ml-auto hidden md:block"
                    style={{ color: "var(--muted)" }}
                  >
                    {ep.desc}
                  </span>
                  <a
                    href="/docs"
                    className="ml-2 shrink-0 transition-colors"
                    style={{ color: "var(--muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                  >
                    <IExternal />
                  </a>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
