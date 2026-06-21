"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      }),
      { threshold: 0.06, rootMargin: "0px 0px -48px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Data ─────────────────────────────────────────────────── */
const FEATURES = [
  {
    gradient: "linear-gradient(135deg,#7c3aed,#6366f1)",
    glow: "rgba(124,58,237,.3)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    badge: "Core", badgeCls: "badge-accent",
    title: "Temporal Supersession",
    desc: "When a user says \"I moved to Austin,\" Tampa is instantly invalidated. Your LLM always gets the current truth.",
  },
  {
    gradient: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
    glow: "rgba(59,130,246,.3)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    badge: "Unique", badgeCls: "badge-blue",
    title: "Certainty Filtering",
    desc: "Hearsay, hypotheticals, and questions are discarded at extraction. Only definitive facts reach the memory store.",
  },
  {
    gradient: "linear-gradient(135deg,#047857,#10b981)",
    glow: "rgba(16,185,129,.3)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    badge: "New", badgeCls: "badge-green",
    title: "Multi-Level Memory",
    desc: "Session memories auto-expire. User memories persist. Agent memories are shared across all users. Three scopes, one API.",
  },
  {
    gradient: "linear-gradient(135deg,#b45309,#f59e0b)",
    glow: "rgba(245,158,11,.3)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
    badge: "", badgeCls: "",
    title: "Hybrid RRF Retrieval",
    desc: "Vector search + knowledge graph fused via Reciprocal Rank Fusion. Sensitivity and certainty weights tune every result.",
  },
  {
    gradient: "linear-gradient(135deg,#9d174d,#ec4899)",
    glow: "rgba(236,72,153,.3)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    badge: "New", badgeCls: "badge-accent",
    title: "Third-Party Facts",
    desc: "Store memories about John, your boss, your mom separately. Retrieve with search_about('john').",
  },
  {
    gradient: "linear-gradient(135deg,#4338ca,#7c3aed)",
    glow: "rgba(99,102,241,.3)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
    badge: "SDK", badgeCls: "badge-accent",
    title: "LangChain + CrewAI",
    desc: "Drop-in EngramMemory, EngramRetriever, and EngramTool. Any agent framework. Zero extra dependencies.",
  },
];

const COMPARISON = [
  { feature: "Temporal supersession",   engram: true,  mem0: false, zep: false },
  { feature: "Certainty filtering",     engram: true,  mem0: false, zep: false },
  { feature: "Contradiction detection", engram: true,  mem0: false, zep: false },
  { feature: "Multi-level memory",      engram: true,  mem0: true,  zep: false },
  { feature: "Third-party facts",       engram: true,  mem0: false, zep: false },
  { feature: "Sensitivity tiers",       engram: true,  mem0: false, zep: false },
  { feature: "Hybrid vector + graph",   engram: true,  mem0: "~",   zep: true  },
  { feature: "Memory compression",      engram: true,  mem0: false, zep: true  },
  { feature: "Batch search API",        engram: true,  mem0: false, zep: false },
  { feature: "GDPR export",             engram: true,  mem0: false, zep: true  },
  { feature: "LangChain integration",   engram: true,  mem0: true,  zep: true  },
  { feature: "Hosted API",              engram: true,  mem0: true,  zep: true  },
];

const PRICING = [
  {
    name: "Free",
    price: { monthly: "$0", annual: "$0" },
    period: "forever",
    desc: "Perfect for side projects and experimentation.",
    features: ["10,000 API calls / month", "Up to 1,000 memories", "Gemini extraction", "Community support"],
    cta: "Get started free",
    href: "/auth",
    pro: false,
  },
  {
    name: "Pro",
    price: { monthly: "$29", annual: "$24" },
    period: "/ month",
    desc: "For production apps that need reliable, scalable memory.",
    features: ["500,000 API calls / month", "Unlimited memories", "Any LLM provider", "Priority support", "Usage analytics"],
    cta: "Start free trial",
    href: "/auth",
    pro: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", annual: "Custom" },
    period: "",
    desc: "Dedicated infrastructure, custom models, SLA guarantee.",
    features: ["Unlimited everything", "Dedicated infrastructure", "99.9% SLA", "Slack support", "Custom models"],
    cta: "Talk to us",
    href: "mailto:venkyjannegorla@gmail.com",
    pro: false,
  },
];

const STEPS = [
  { n: "01", title: "Get your API key", desc: "Sign up in 30 seconds. Your API key is provisioned instantly — no credit card required." },
  { n: "02", title: "Send conversations", desc: "POST your messages. Engram extracts facts, detects changes, and invalidates stale data automatically." },
  { n: "03", title: "Inject context", desc: "Call /context before your LLM. Get a clean, ranked, non-contradictory context string ready to inject." },
];

const WORKS_WITH = ["OpenAI", "Anthropic", "Google Gemini", "LangChain", "CrewAI", "AutoGen"];

const HERO_CODE = `import requests

KEY  = "engrm_your_key"
BASE = "https://engram-api-venky.fly.dev"

# Tampa is auto-invalidated when Austin is added
requests.post(f"{BASE}/v1/memories",
  headers={"X-API-Key": KEY},
  json={
    "messages": [
      {"role":"user","content":"Just moved to Austin!"}
    ],
    "user_id": "alice"
  }
)

# Returns Austin only ✓ — Tampa is gone
ctx = requests.get(f"{BASE}/v1/memories/context",
  headers={"X-API-Key": KEY},
  params={"query": "where does alice live",
          "user_id": "alice"}
).json()["context"]`;

const PROBLEM_CODE = `# Every other memory API
memory.add("I live in Tampa")   # stored ✓
memory.add("I moved to Austin") # ALSO stored ✗

memory.search("where do I live?")
# → ["Tampa", "Austin"]
# LLM: "You seem to live in both..." 🤦`;

const SOLUTION_CODE = `# Engram — temporal supersession
memory.add("I live in Tampa")   # stored ✓
memory.add("I moved to Austin") # Tampa invalidated ✓

memory.search("where do I live?")
# → ["Austin"]
# LLM: "You live in Austin, TX."  ✓`;

function Cell({ val }: { val: boolean | string }) {
  if (val === true)  return <span style={{ color: "#34d399", fontSize: 16, fontWeight: 700 }}>✓</span>;
  if (val === "~")   return <span style={{ color: "#fbbf24", fontSize: 12, fontWeight: 600 }}>Partial</span>;
  return <span style={{ color: "rgba(255,255,255,.12)", fontSize: 16 }}>—</span>;
}

/* ── Page ─────────────────────────────────────────────────── */
export default function Home() {
  useReveal();
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ══ Navbar ══════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 glass-nav"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 18px rgba(124,58,237,.5)" }}
            >E</div>
            <span className="font-bold text-base tracking-tight">Engram</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium">
            {[["#features","Features"],["#pricing","Pricing"],["#compare","Compare"]].map(([h,l]) => (
              <a key={h} href={h} style={{ color: "var(--muted-b)" }}
                className="transition-colors hover:text-white">{l}</a>
            ))}
            <Link href="/docs" style={{ color: "var(--muted-b)" }} className="transition-colors hover:text-white">Docs</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth" className="hidden md:block text-sm font-medium transition-colors hover:text-white" style={{ color: "var(--muted-b)" }}>
              Sign in
            </Link>
            <Link href="/auth" className="btn-primary text-sm px-5 py-2.5 rounded-xl">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ Hero ════════════════════════════════════════════ */}
      {/* paddingTop 64px = navbar height, then inner padding adds breathing room */}
      <section className="relative overflow-hidden" style={{ paddingTop: 64 }}>
        <div className="absolute inset-0 dot-grid" style={{ opacity: .3 }} />
        <div className="orb anim-orb" style={{ width: 800, height: 800, top: -250, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle,#7c3aed,transparent 70%)", opacity: .13 }} />
        <div className="orb" style={{ width: 400, height: 400, top: 120, right: "4%", background: "radial-gradient(circle,#3b82f6,transparent 70%)", opacity: .08 }} />
        <div className="orb" style={{ width: 300, height: 300, top: 250, left: "2%", background: "radial-gradient(circle,#6366f1,transparent 70%)", opacity: .07 }} />

        {/* Decorative rings */}
        <div className="absolute top-28 right-[7%] anim-spin-s hidden xl:block" style={{ width: 240, height: 240, border: "1px solid rgba(124,58,237,.25)", borderRadius: "50%", borderTopColor: "rgba(124,58,237,.7)", opacity: .5 }} />
        <div className="absolute top-40 right-[9%] hidden xl:block" style={{ width: 180, height: 180, border: "1px dashed rgba(139,92,246,.3)", borderRadius: "50%", opacity: .5 }} />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 mb-8 anim-fade-up">
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(124,58,237,.14)", border: "1px solid rgba(124,58,237,.3)", color: "#c4b5fd" }}>
              <span className="anim-pulse-dot w-1.5 h-1.5 rounded-full" style={{ background: "#34d399", display: "inline-block" }} />
              Temporal Supersession API — now live
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-extrabold leading-[1.06] mb-6 anim-fade-up anim-d1"
            style={{ fontSize: "clamp(2.4rem,6vw,4.8rem)", letterSpacing: "-0.04em" }}>
            Memory for AI that{" "}
            <br className="hidden sm:block" />
            <span className="grad-text-anim">never gets it wrong.</span>
          </h1>

          <p className="text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed anim-fade-up anim-d2"
            style={{ color: "var(--muted-b)" }}>
            Most memory APIs are append-only — stale facts pile up and confuse your LLM.
            Engram automatically <strong style={{ color: "var(--text)", fontWeight: 600 }}>invalidates outdated facts</strong> the moment users update them.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-16 anim-fade-up anim-d3">
            <Link href="/auth" className="btn-primary px-8 py-3.5 rounded-xl text-sm font-semibold">
              Start for free →
            </Link>
            <Link href="/docs" className="btn-outline px-8 py-3.5 rounded-xl text-sm font-semibold">
              View the docs
            </Link>
          </div>

          {/* Code block */}
          <div className="max-w-3xl mx-auto anim-fade-up anim-d4 anim-float"
            style={{ animationDelay: "0.32s, 1.2s", filter: "drop-shadow(0 0 50px rgba(124,58,237,.22)) drop-shadow(0 20px 70px rgba(0,0,0,.75))" }}>
            <div className="code-block text-left">
              <div className="code-block-header">
                <div className="dot dot-r" /><div className="dot dot-y" /><div className="dot dot-g" />
                <span className="ml-3 text-xs" style={{ color: "rgba(255,255,255,.28)", fontFamily: "var(--font-geist-mono)" }}>quickstart.py</span>
                <span className="ml-auto badge badge-accent" style={{ fontSize: 11 }}>Python</span>
              </div>
              <pre className="p-6 text-sm leading-relaxed overflow-x-auto"
                style={{ color: "#c4b5fd", fontFamily: "var(--font-geist-mono)", tabSize: 2 }}>{HERO_CODE}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Stats ═══════════════════════════════════════════ */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { n: "< 50ms", label: "avg API response" },
            { n: "99.9%",  label: "uptime SLA" },
            { n: "14+",    label: "unique features" },
            { n: "4",      label: "LLM providers" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold tracking-tight grad-text mb-1.5" style={{ letterSpacing: "-0.03em" }}>{s.n}</div>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ Works with ══════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-14 reveal">
        <p className="text-center text-[11px] font-bold tracking-[0.18em] uppercase mb-7" style={{ color: "var(--muted)" }}>
          Works with your stack
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {WORKS_WITH.map((w) => (
            <span key={w} className="px-5 py-2.5 rounded-full text-sm font-medium"
              style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border-b)", color: "var(--muted-b)" }}>{w}</span>
          ))}
        </div>
      </section>

      {/* ══ Problem / Solution ══════════════════════════════ */}
      <section style={{ background: "var(--bg-section)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-14 reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ letterSpacing: "-0.03em" }}>
              The problem with every other memory API
            </h2>
            <p className="text-lg" style={{ color: "var(--muted-b)" }}>
              Append-only storage means contradictions. Engram eliminates them automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="reveal r-d1">
              <div className="code-block" style={{ border: "1px solid rgba(239,68,68,.14)" }}>
                <div className="code-block-header" style={{ borderColor: "rgba(239,68,68,.08)" }}>
                  <div className="dot dot-r" /><div className="dot dot-r" /><div className="dot dot-r" />
                  <span className="ml-3 text-xs font-semibold" style={{ color: "#f87171" }}>✗  Without Engram</span>
                </div>
                <pre className="p-6 text-sm leading-loose overflow-x-auto"
                  style={{ color: "#fca5a5", fontFamily: "var(--font-geist-mono)" }}>{PROBLEM_CODE}</pre>
              </div>
            </div>
            <div className="reveal r-d2">
              <div className="code-block" style={{ border: "1px solid rgba(16,185,129,.14)" }}>
                <div className="code-block-header" style={{ borderColor: "rgba(16,185,129,.08)" }}>
                  <div className="dot dot-g" /><div className="dot dot-g" /><div className="dot dot-g" />
                  <span className="ml-3 text-xs font-semibold" style={{ color: "#34d399" }}>✓  With Engram</span>
                </div>
                <pre className="p-6 text-sm leading-loose overflow-x-auto"
                  style={{ color: "#6ee7b7", fontFamily: "var(--font-geist-mono)" }}>{SOLUTION_CODE}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Features ════════════════════════════════════════ */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16 reveal">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: "rgba(124,58,237,.14)", border: "1px solid rgba(124,58,237,.3)", color: "#c4b5fd" }}>
            Everything you need
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ letterSpacing: "-0.03em" }}>
            Production-grade features
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--muted-b)" }}>
            Built for AI developers who need memory that actually reflects reality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title}
              className={`card p-7 flex flex-col reveal r-d${(i % 3) + 1}`}>
              {/* Icon + badge row */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0"
                  style={{ background: f.gradient, boxShadow: `0 4px 18px ${f.glow}` }}>
                  {f.icon}
                </div>
                {f.badge && <span className={`badge ${f.badgeCls} text-[11px]`}>{f.badge}</span>}
              </div>
              <h3 className="font-bold text-[15px] mb-2" style={{ color: "var(--text)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-b)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ Memory Architecture ═════════════════════════════ */}
      <section style={{ background: "var(--bg-section)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16 reveal">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: "rgba(124,58,237,.14)", border: "1px solid rgba(124,58,237,.3)", color: "#c4b5fd" }}>
              Memory Architecture
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ letterSpacing: "-0.03em" }}>
              Two dimensions, total control
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--muted-b)" }}>
              Every memory has a <strong style={{ color: "var(--text)", fontWeight: 600 }}>type</strong> (what kind of fact) and a{" "}
              <strong style={{ color: "var(--text)", fontWeight: 600 }}>level</strong> (how long it lives). Together they give you precision control over what your LLM remembers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Memory Types */}
            <div className="reveal r-d1">
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                {/* Header */}
                <div className="px-6 py-4 flex items-center gap-3"
                  style={{ background: "rgba(124,58,237,.08)", borderBottom: "1px solid var(--border)" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: "var(--text)" }}>Memory Types</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>What kind of fact is it?</div>
                  </div>
                </div>

                {/* Rows */}
                {[
                  {
                    badge: "semantic",
                    badgeColor: "#c4b5fd",
                    badgeBg: "rgba(124,58,237,.18)",
                    badgeBorder: "rgba(124,58,237,.3)",
                    title: "Current-state facts",
                    desc: "Slot-based supersession — new value for the same subject + slot automatically invalidates the old one.",
                    example: '"User lives in Austin, TX."',
                    exampleColor: "#a78bfa",
                  },
                  {
                    badge: "episodic",
                    badgeColor: "#93c5fd",
                    badgeBg: "rgba(59,130,246,.16)",
                    badgeBorder: "rgba(59,130,246,.3)",
                    title: "Historical events",
                    desc: "Accumulates over time. Semantically similar duplicates are collapsed post-retrieval.",
                    example: '"User ran the Boston Marathon in 3h 42m."',
                    exampleColor: "#60a5fa",
                  },
                  {
                    badge: "procedural",
                    badgeColor: "#6ee7b7",
                    badgeBg: "rgba(16,185,129,.16)",
                    badgeBorder: "rgba(16,185,129,.3)",
                    title: "Habits and skills",
                    desc: "Never superseded, only accumulated. Captures how a user prefers to interact.",
                    example: '"User prefers concise bullet-point answers."',
                    exampleColor: "#34d399",
                  },
                ].map((item, i) => (
                  <div key={item.badge}
                    className="px-6 py-4 flex flex-col gap-2"
                    style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined, background: "rgba(255,255,255,.02)" }}>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                        style={{ background: item.badgeBg, color: item.badgeColor, border: `1px solid ${item.badgeBorder}`, fontFamily: "var(--font-geist-mono)" }}>
                        {item.badge}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{item.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed pl-0.5" style={{ color: "var(--muted-b)" }}>{item.desc}</p>
                    <code className="text-[11px] px-3 py-1.5 rounded-lg mt-0.5"
                      style={{ background: "rgba(255,255,255,.04)", color: item.exampleColor, fontFamily: "var(--font-geist-mono)", border: "1px solid var(--border)" }}>
                      {item.example}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory Levels */}
            <div className="reveal r-d2">
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                {/* Header */}
                <div className="px-6 py-4 flex items-center gap-3"
                  style={{ background: "rgba(59,130,246,.07)", borderBottom: "1px solid var(--border)" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: "var(--text)" }}>Memory Levels</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>How long does it live?</div>
                  </div>
                </div>

                {/* Rows */}
                {[
                  {
                    badge: "session",
                    badgeColor: "#fcd34d",
                    badgeBg: "rgba(245,158,11,.16)",
                    badgeBorder: "rgba(245,158,11,.3)",
                    title: "Conversation-scoped",
                    desc: "Tied to a single session. Auto-expires when the conversation ends — never leaks into future chats.",
                    example: '"User is currently browsing winter jackets."',
                    exampleColor: "#fbbf24",
                  },
                  {
                    badge: "user",
                    badgeColor: "#c4b5fd",
                    badgeBg: "rgba(124,58,237,.16)",
                    badgeBorder: "rgba(124,58,237,.3)",
                    title: "Long-term per-user",
                    desc: "Persists indefinitely across all sessions. The default level — your main memory store.",
                    example: '"User is a Senior Engineer at DataStream Inc."',
                    exampleColor: "#a78bfa",
                  },
                  {
                    badge: "agent",
                    badgeColor: "#86efac",
                    badgeBg: "rgba(34,197,94,.14)",
                    badgeBorder: "rgba(34,197,94,.28)",
                    title: "Shared across all users",
                    desc: "Global knowledge for your app or agent — visible to every user, ideal for product FAQs and shared context.",
                    example: '"Refund window is 30 days from purchase."',
                    exampleColor: "#4ade80",
                  },
                ].map((item, i) => (
                  <div key={item.badge}
                    className="px-6 py-4 flex flex-col gap-2"
                    style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined, background: "rgba(255,255,255,.02)" }}>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                        style={{ background: item.badgeBg, color: item.badgeColor, border: `1px solid ${item.badgeBorder}`, fontFamily: "var(--font-geist-mono)" }}>
                        {item.badge}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{item.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed pl-0.5" style={{ color: "var(--muted-b)" }}>{item.desc}</p>
                    <code className="text-[11px] px-3 py-1.5 rounded-lg mt-0.5"
                      style={{ background: "rgba(255,255,255,.04)", color: item.exampleColor, fontFamily: "var(--font-geist-mono)", border: "1px solid var(--border)" }}>
                      {item.example}
                    </code>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Combined usage hint */}
          <div className="mt-6 rounded-2xl px-6 py-5 flex flex-col md:flex-row items-start md:items-center gap-4 reveal"
            style={{ background: "rgba(255,255,255,.03)", border: "1px solid var(--border)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(124,58,237,.2)", color: "#c4b5fd" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="text-sm" style={{ color: "var(--muted-b)" }}>
              Types and levels are independent — a{" "}
              <code style={{ color: "#a78bfa", fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>semantic</code>{" "}
              memory can be{" "}
              <code style={{ color: "#fbbf24", fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>session</code>-scoped,{" "}
              <code style={{ color: "#c4b5fd", fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>user</code>-scoped, or{" "}
              <code style={{ color: "#4ade80", fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>agent</code>-scoped.
              Mix and match to model exactly what your app needs.
            </p>
          </div>
        </div>
      </section>

      {/* ══ How it works ════════════════════════════════════ */}
      <section style={{ background: "var(--bg)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ letterSpacing: "-0.03em" }}>
              Up and running in minutes
            </h2>
            <p className="text-lg" style={{ color: "var(--muted-b)" }}>
              No database to configure. No embedding model to host. Just call the API.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative reveal" style={{ transitionDelay: `${i * 0.09}s` }}>
                {/* Connector line between steps */}
                {i < STEPS.length - 1 && (
                  <div className="absolute hidden md:block"
                    style={{
                      top: 20,                    /* vertically centered with the 40px step box */
                      left: 48,                   /* start right after the box (40px) + 8px gap */
                      width: "calc(100% - 8px)",  /* fill to end of column, connector picks up in next col */
                      height: 1,
                      background: "linear-gradient(to right, rgba(124,58,237,.4), transparent)",
                    }}
                  />
                )}
                {/* Step number */}
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold text-white mb-5 relative z-10"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 18px rgba(124,58,237,.4)" }}>
                  {s.n}
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-b)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Comparison ══════════════════════════════════════ */}
      <section id="compare" className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14 reveal">
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ letterSpacing: "-0.03em" }}>
            How Engram compares
          </h2>
          <p className="text-lg" style={{ color: "var(--muted-b)" }}>
            We built the features Mem0 and Zep haven&apos;t shipped yet.
          </p>
        </div>

        <div className="rounded-2xl overflow-x-auto reveal" style={{ border: "1px solid var(--border)" }}>
          <table className="w-full text-sm border-collapse min-w-[520px]">
            <thead>
              <tr style={{ background: "rgba(255,255,255,.03)", borderBottom: "1px solid var(--border)" }}>
                <th className="text-left px-6 py-4 font-semibold text-sm" style={{ color: "var(--muted-b)" }}>Feature</th>
                <th className="px-6 py-4 text-center font-bold text-sm w-28" style={{ color: "#c4b5fd", background: "rgba(124,58,237,.06)" }}>Engram</th>
                <th className="px-6 py-4 text-center font-medium text-sm w-24" style={{ color: "var(--muted)" }}>Mem0</th>
                <th className="px-6 py-4 text-center font-medium text-sm w-24" style={{ color: "var(--muted)" }}>Zep</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.feature}
                  style={{ borderTop: "1px solid var(--border)", background: i % 2 === 0 ? "rgba(255,255,255,.015)" : "transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "rgba(255,255,255,.015)" : "transparent")}
                >
                  <td className="px-6 py-3 font-medium text-sm" style={{ color: "var(--text-2)" }}>{row.feature}</td>
                  <td className="px-6 py-3 text-center" style={{ background: "rgba(124,58,237,.03)" }}><Cell val={row.engram} /></td>
                  <td className="px-6 py-3 text-center"><Cell val={row.mem0} /></td>
                  <td className="px-6 py-3 text-center"><Cell val={row.zep} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-xs mt-4" style={{ color: "var(--muted)" }}>
          ~ = partial support · Based on public documentation as of June 2026.
        </p>
      </section>

      {/* ══ Pricing ══════════════════════════════════════════ */}
      <section id="pricing" style={{ background: "var(--bg-section)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-14 reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ letterSpacing: "-0.03em" }}>
              Simple, honest pricing
            </h2>
            <p className="text-lg mb-8" style={{ color: "var(--muted-b)" }}>Start free. Upgrade when you need more.</p>

            {/* Toggle */}
            <div className="inline-flex items-center rounded-xl p-1 gap-1"
              style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border-b)" }}>
              <button onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${!annual ? "btn-primary" : ""}`}
                style={!annual ? {} : { color: "var(--muted-b)", background: "transparent", border: "none" }}>
                Monthly
              </button>
              <button onClick={() => setAnnual(true)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${annual ? "btn-primary" : ""}`}
                style={annual ? {} : { color: "var(--muted-b)", background: "transparent", border: "none" }}>
                Annual
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ background: annual ? "rgba(255,255,255,.2)" : "rgba(124,58,237,.2)", color: annual ? "#fff" : "#c4b5fd" }}>
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* Cards — all same height, aligned top */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {PRICING.map((plan) => (
              <div key={plan.name}
                className="rounded-2xl p-8 flex flex-col reveal"
                style={plan.pro ? {
                  /* CSS gradient border trick — clean, no wrapper div */
                  background: "linear-gradient(rgba(11,9,24,.97), rgba(11,9,24,.97)) padding-box, linear-gradient(135deg,#7c3aed,#4f46e5,#3b82f6) border-box",
                  border: "1.5px solid transparent",
                  boxShadow: "0 0 60px rgba(124,58,237,.18), 0 16px 60px rgba(0,0,0,.5)",
                  position: "relative",
                } : {
                  background: "rgba(255,255,255,.035)",
                  border: "1px solid var(--border)",
                  backdropFilter: "blur(16px)",
                }}>

                {plan.pro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full text-[11px] font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 16px rgba(124,58,237,.5)" }}>
                      Most popular
                    </span>
                  </div>
                )}

                {/* Card header */}
                <div className="mb-6 mt-2">
                  <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>{plan.name}</h3>
                  <p className="text-sm" style={{ color: "var(--muted-b)" }}>{plan.desc}</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-7">
                  <span className={`text-5xl font-extrabold tracking-tight ${plan.pro ? "grad-text" : ""}`}
                    style={{ letterSpacing: "-0.04em", color: plan.pro ? undefined : "var(--text)" }}>
                    {annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.period && (
                    <span className="text-sm" style={{ color: "var(--muted)" }}>{plan.period}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={plan.pro
                          ? { background: "rgba(124,58,237,.22)", color: "#c4b5fd" }
                          : { background: "var(--green-pale)", color: "var(--green-b)" }}>
                        ✓
                      </span>
                      <span style={{ color: "var(--text-2)" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={plan.href}
                  className={`block text-center py-3.5 rounded-xl text-sm font-bold transition-all ${plan.pro ? "btn-primary" : ""}`}
                  style={plan.pro ? {} : {
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid var(--border-b)",
                    color: "var(--text-2)",
                  }}
                  onMouseEnter={plan.pro ? undefined : e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.10)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text)";
                  }}
                  onMouseLeave={plan.pro ? undefined : e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.06)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-2)";
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#05050d" }}>
        <div className="absolute inset-0 dot-grid" style={{ opacity: .18 }} />
        <div className="orb anim-orb" style={{ width: 700, height: 700, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle,#7c3aed,transparent 70%)", opacity: .16 }} />
        <div className="orb" style={{ width: 320, height: 320, top: "20%", right: "8%", background: "radial-gradient(circle,#3b82f6,transparent 70%)", opacity: .09 }} />

        <div className="relative max-w-3xl mx-auto px-6 py-32 text-center reveal">
          <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold mb-6 tracking-widest uppercase"
            style={{ background: "rgba(124,58,237,.16)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,.28)" }}>
            Ready to ship?
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight"
            style={{ letterSpacing: "-0.04em" }}>
            Give your AI
            <br />
            <span className="grad-text-anim">a real memory.</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "var(--muted-b)" }}>
            Sign up in 30 seconds. First 10,000 calls are free, forever.
          </p>
          <Link href="/auth" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-sm font-bold text-white btn-primary">
            Get your free API key →
          </Link>
        </div>
      </section>

      {/* ══ Footer ══════════════════════════════════════════ */}
      <footer style={{ background: "var(--bg-section)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2.5" style={{ color: "var(--muted-b)" }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>E</div>
            <span>
              © 2026 Engram · Built by{" "}
              <a href="https://github.com/VenkateswaraRao18" className="font-medium transition-colors hover:text-white" style={{ color: "var(--text-2)" }}>
                Venky Jannegorla
              </a>
            </span>
          </div>

          <div className="flex items-center gap-6" style={{ color: "var(--muted-b)" }}>
            <Link href="/docs" className="text-sm transition-colors hover:text-white" style={{ color: "var(--muted-b)" }}>Docs</Link>
            <a href="https://github.com/VenkateswaraRao18/Engram" className="text-sm transition-colors hover:text-white" style={{ color: "var(--muted-b)" }}>GitHub</a>
            <a href="mailto:venkyjannegorla@gmail.com" className="text-sm transition-colors hover:text-white" style={{ color: "var(--muted-b)" }}>Contact</a>
            <span className="flex items-center gap-1.5 text-sm" style={{ color: "#34d399" }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#34d399", display: "inline-block" }} />
              All systems operational
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
