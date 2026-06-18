"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ── Scroll-reveal hook ─────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Data ───────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    badge: "Core", badgeCls: "badge-accent",
    title: "Temporal Supersession",
    desc: "When a user says 'I moved to Austin,' Tampa is instantly invalidated. Your LLM gets the current truth — always.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </svg>
    ),
    badge: "Unique", badgeCls: "badge-green",
    title: "Certainty Filtering",
    desc: "Hearsay, hypotheticals, and questions are discarded at extraction. Only definitive facts reach the memory store.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    badge: "New", badgeCls: "badge-blue",
    title: "Multi-Level Memory",
    desc: "Session memories auto-expire. User memories persist. Agent memories are shared across all users. Three scopes, one API.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
    badge: "", badgeCls: "",
    title: "Hybrid RRF Retrieval",
    desc: "Vector search + knowledge graph fused via Reciprocal Rank Fusion. Sensitivity and certainty weights tune every result.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    badge: "New", badgeCls: "badge-blue",
    title: "Third-Party Facts",
    desc: "Store memories about John, your boss, your mom — separately from user facts. Retrieve with search_about('john').",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
    badge: "New", badgeCls: "badge-blue",
    title: "LangChain + CrewAI",
    desc: "Drop-in EngramMemory, EngramRetriever, and EngramTool classes. Any agent framework. Zero extra dependencies.",
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
  { feature: "Webhook events",          engram: true,  mem0: false, zep: false },
  { feature: "GDPR export",            engram: true,  mem0: false, zep: true  },
  { feature: "LangChain integration",   engram: true,  mem0: true,  zep: true  },
  { feature: "Hosted API",             engram: true,  mem0: true,  zep: true  },
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
    highlight: false,
    dark: false,
  },
  {
    name: "Pro",
    price: { monthly: "$29", annual: "$24" },
    period: "/ month",
    desc: "For production apps that need reliable, scalable memory.",
    features: ["500,000 API calls / month", "Unlimited memories", "Any LLM provider", "Priority email support", "Usage analytics"],
    cta: "Start free trial",
    href: "/auth",
    highlight: true,
    dark: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", annual: "Custom" },
    period: "",
    desc: "Dedicated infrastructure, custom models, SLA guarantee.",
    features: ["Unlimited everything", "Dedicated infrastructure", "99.9% SLA", "Slack support", "Custom models"],
    cta: "Talk to us",
    href: "mailto:venkyjannegorla@gmail.com",
    highlight: false,
    dark: false,
  },
];

const STEPS = [
  {
    n: "01", title: "Get your API key",
    desc: "Sign up in 30 seconds. Your API key is provisioned instantly — no credit card required.",
  },
  {
    n: "02", title: "Send conversations",
    desc: "POST your conversation messages. Engram extracts facts, detects changes, and invalidates stale data automatically.",
  },
  {
    n: "03", title: "Inject context",
    desc: "Call /context before your LLM. Get a clean, ranked, non-contradictory context string ready to inject.",
  },
];

const WORKS_WITH = ["OpenAI","Anthropic","Google Gemini","LangChain","CrewAI","AutoGen"];

/* ── Helpers ────────────────────────────────────────────────── */
function Cell({ val }: { val: boolean | string }) {
  if (val === true)
    return (
      <span style={{ color: "var(--green)", fontSize: 16, fontWeight: 700 }}>✓</span>
    );
  if (val === "~")
    return (
      <span style={{ color: "var(--yellow)", fontSize: 13, fontWeight: 600 }}>Partial</span>
    );
  return (
    <span style={{ color: "var(--border-b)", fontSize: 16, fontWeight: 400 }}>—</span>
  );
}

/* ── Code snippets ──────────────────────────────────────────── */
const HERO_CODE = `import requests

KEY  = "engrm_your_key"
BASE = "https://engram-api-venky.fly.dev"

# Store — Tampa auto-invalidated when Austin added
requests.post(f"{BASE}/v1/memories",
  headers={"X-API-Key": KEY},
  json={
    "messages": [
      {"role":"user","content":"Just moved to Austin!"}
    ],
    "user_id": "alice"
  }
)

# Inject context — returns Austin only ✓
ctx = requests.get(f"{BASE}/v1/memories/context",
  headers={"X-API-Key": KEY},
  params={"query":"where does alice live","user_id":"alice"}
).json()["context"]`;

const PROBLEM_CODE = `# Every other memory API
memory.add("I live in Tampa")   # stored ✓
memory.add("I moved to Austin") # ALSO stored ✗

memory.search("where do I live?")
# → ["Tampa", "Austin"]
# LLM: "You seem to live in both Tampa
#       and Austin..."  🤦`;

const SOLUTION_CODE = `# Engram with temporal supersession
memory.add("I live in Tampa")   # stored ✓
memory.add("I moved to Austin") # Tampa invalidated ✓

memory.search("where do I live?")
# → ["Austin"]
# LLM: "You live in Austin, TX."  ✓`;

/* ── Page ───────────────────────────────────────────────────── */
export default function Home() {
  useReveal();
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ══ Navbar ══ */}
      <nav
        className="sticky top-0 z-50 glass-light"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "var(--accent)" }}
            >E</div>
            <span className="font-bold text-base tracking-tight">Engram</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "var(--muted-b)" }}>
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#compare" className="hover:text-gray-900 transition-colors">Compare</a>
            <Link href="/docs" className="hover:text-gray-900 transition-colors">Docs</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="hidden md:block text-sm font-medium transition-colors"
              style={{ color: "var(--muted-b)" }}
            >
              Sign in
            </Link>
            <Link
              href="/auth"
              className="btn-primary text-sm px-5 py-2.5 rounded-xl"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ Hero ══ */}
      <section className="relative overflow-hidden" style={{ background: "var(--bg)" }}>
        {/* Background: dot grid + soft radial */}
        <div className="absolute inset-0 dot-grid" style={{ opacity: .55 }} />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 50% 0%, rgba(79,70,229,.08) 0%, transparent 70%),
              radial-gradient(ellipse 40% 30% at 80% 10%, rgba(99,102,241,.05) 0%, transparent 60%)
            `,
          }}
        />

        {/* Decorative spinning ring */}
        <div
          className="absolute top-20 right-[8%] anim-spin-s opacity-30 hidden xl:block"
          style={{
            width: 240, height: 240,
            border: "1px solid rgba(79,70,229,.3)",
            borderRadius: "50%",
            borderTopColor: "rgba(79,70,229,.7)",
          }}
        />
        <div
          className="absolute top-32 right-[10%] opacity-20 hidden xl:block"
          style={{
            width: 180, height: 180,
            border: "1px dashed rgba(99,102,241,.5)",
            borderRadius: "50%",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-16 text-center">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 mb-7 anim-fade-up">
            <span className="badge badge-accent text-xs">
              <span className="anim-pulse-dot w-2 h-2 rounded-full inline-block" style={{ background: "#22c55e" }} />
              Temporal Supersession API — now live
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 anim-fade-up anim-d1"
            style={{ letterSpacing: "-0.03em" }}
          >
            Memory for AI that{" "}
            <br className="hidden md:block" />
            <span className="grad-text-anim">never gets it wrong.</span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 anim-fade-up anim-d2 leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            Most memory APIs are append-only — stale facts pile up and confuse your LLM.
            Engram automatically <strong style={{ color: "var(--text)", fontWeight: 700 }}>invalidates outdated facts</strong> the moment users update them.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16 anim-fade-up anim-d3">
            <Link href="/auth" className="btn-primary px-8 py-3.5 rounded-xl text-sm">
              Start for free →
            </Link>
            <Link href="/docs" className="btn-outline px-8 py-3.5 rounded-xl text-sm">
              View the docs
            </Link>
          </div>

          {/* Hero code window */}
          <div className="max-w-3xl mx-auto anim-fade-up anim-d4 anim-float" style={{ animationDelay: "0.32s, 1s" }}>
            <div className="code-block text-left">
              <div className="code-block-header">
                <div className="dot dot-r" /><div className="dot dot-y" /><div className="dot dot-g" />
                <span className="ml-3 text-xs" style={{ color: "rgba(255,255,255,.35)", fontFamily: "var(--font-geist-mono)" }}>
                  quickstart.py
                </span>
                <span className="ml-auto badge badge-accent text-xs">Python</span>
              </div>
              <pre
                className="p-6 text-sm leading-relaxed overflow-x-auto"
                style={{ color: "#c4b5fd", fontFamily: "var(--font-geist-mono)", tabSize: 2 }}
              >
                {HERO_CODE}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Stats bar ══ */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-subtle)" }}>
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-12">
          {[
            { n: "< 50ms", label: "avg API response" },
            { n: "99.9%",  label: "uptime SLA" },
            { n: "12+",    label: "unique features" },
            { n: "4",      label: "LLM providers" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: "var(--text)" }}>{s.n}</div>
              <div className="text-xs mt-0.5 font-medium" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ Works with ══ */}
      <section className="max-w-5xl mx-auto px-6 py-14 reveal">
        <p
          className="text-center text-xs font-semibold tracking-widest mb-7 uppercase"
          style={{ color: "var(--muted)" }}
        >
          Works with your stack
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {WORKS_WITH.map((w) => (
            <span
              key={w}
              className="px-5 py-2.5 rounded-full text-sm font-medium"
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--border)",
                color: "var(--text-2)",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      </section>

      {/* ══ Problem / Solution ══ */}
      <section style={{ background: "var(--bg-section)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14 reveal">
            <h2
              className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
              style={{ letterSpacing: "-0.025em" }}
            >
              The problem with every other memory API
            </h2>
            <p className="text-lg" style={{ color: "var(--muted-b)" }}>
              Append-only storage means contradictions. Engram eliminates them automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Problem */}
            <div className="reveal r-d1">
              <div className="code-block">
                <div className="code-block-header" style={{ borderColor: "rgba(239,68,68,.15)" }}>
                  <div className="dot dot-r" /><div className="dot dot-r" /><div className="dot dot-r" />
                  <span className="ml-3 text-xs font-semibold" style={{ color: "#f87171" }}>
                    ✗  Without Engram
                  </span>
                </div>
                <pre
                  className="p-6 text-sm leading-loose overflow-x-auto"
                  style={{ color: "#fca5a5", fontFamily: "var(--font-geist-mono)" }}
                >
                  {PROBLEM_CODE}
                </pre>
              </div>
            </div>

            {/* Solution */}
            <div className="reveal r-d2">
              <div className="code-block" style={{ border: "1px solid rgba(16,185,129,.15)" }}>
                <div className="code-block-header" style={{ borderColor: "rgba(16,185,129,.12)" }}>
                  <div className="dot dot-g" /><div className="dot dot-g" /><div className="dot dot-g" />
                  <span className="ml-3 text-xs font-semibold" style={{ color: "#34d399" }}>
                    ✓  With Engram
                  </span>
                </div>
                <pre
                  className="p-6 text-sm leading-loose overflow-x-auto"
                  style={{ color: "#6ee7b7", fontFamily: "var(--font-geist-mono)" }}
                >
                  {SOLUTION_CODE}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Features ══ */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16 reveal">
          <span className="badge badge-accent mb-4">Everything you need</span>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ letterSpacing: "-0.025em" }}
          >
            Production-grade features
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--muted-b)" }}>
            Built for AI developers who need memory that actually reflects reality — not just a growing pile of facts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`card p-7 cursor-default reveal r-d${(i % 3) + 1}`}>
              <div className="flex items-start justify-between mb-5">
                <div
                  className="icon-box"
                  style={{ background: "var(--accent-pale)", color: "var(--accent)" }}
                >
                  {f.icon}
                </div>
                {f.badge && (
                  <span className={`badge ${f.badgeCls} text-xs`}>{f.badge}</span>
                )}
              </div>
              <h3 className="font-semibold text-[15px] mb-2" style={{ color: "var(--text)" }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-b)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ How it works ══ */}
      <section
        style={{
          background: "var(--bg-section)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-16 reveal">
            <h2
              className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
              style={{ letterSpacing: "-0.025em" }}
            >
              Up and running in minutes
            </h2>
            <p className="text-lg" style={{ color: "var(--muted-b)" }}>
              No database to configure. No embedding model to host. Just call the API.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                {i < STEPS.length - 1 && (
                  <div
                    className="absolute top-5 left-14 hidden md:block"
                    style={{
                      width: "calc(100% + 2.5rem)",
                      height: 1,
                      background: "linear-gradient(to right, var(--border-b), transparent)",
                    }}
                  />
                )}
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold mb-5 relative z-10"
                  style={{
                    background: "var(--accent-pale)",
                    color: "var(--accent)",
                    border: "1px solid rgba(79,70,229,.18)",
                  }}
                >
                  {s.n}
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-b)" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Comparison ══ */}
      <section id="compare" className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14 reveal">
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ letterSpacing: "-0.025em" }}
          >
            How Engram compares
          </h2>
          <p className="text-lg" style={{ color: "var(--muted-b)" }}>
            We built the features Mem0 and Zep haven&apos;t shipped yet.
          </p>
        </div>

        <div
          className="rounded-2xl overflow-hidden reveal"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--sh)" }}
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)" }}>
                <th
                  className="text-left px-6 py-4 font-semibold text-sm"
                  style={{ color: "var(--muted-b)" }}
                >
                  Feature
                </th>
                <th
                  className="px-6 py-4 text-center font-bold text-sm"
                  style={{ color: "var(--accent)", background: "rgba(79,70,229,.03)" }}
                >
                  Engram
                </th>
                <th className="px-6 py-4 text-center font-medium text-sm" style={{ color: "var(--muted)" }}>
                  Mem0
                </th>
                <th className="px-6 py-4 text-center font-medium text-sm" style={{ color: "var(--muted)" }}>
                  Zep
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr
                  key={row.feature}
                  className="group transition-colors duration-100"
                  style={{
                    borderTop: "1px solid var(--border)",
                    background: i % 2 === 0 ? "var(--surface)" : "var(--bg-subtle)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      i % 2 === 0 ? "var(--surface)" : "var(--bg-subtle)")
                  }
                >
                  <td className="px-6 py-3.5 font-medium text-sm" style={{ color: "var(--text-2)" }}>
                    {row.feature}
                  </td>
                  <td
                    className="px-6 py-3.5 text-center"
                    style={{ background: "rgba(79,70,229,.02)" }}
                  >
                    <Cell val={row.engram} />
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Cell val={row.mem0} />
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Cell val={row.zep} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--muted)" }}>
          ~ = partial support · Based on public documentation as of June 2026.
        </p>
      </section>

      {/* ══ Pricing ══ */}
      <section
        id="pricing"
        style={{ background: "var(--bg-section)", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-14 reveal">
            <h2
              className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
              style={{ letterSpacing: "-0.025em" }}
            >
              Simple, honest pricing
            </h2>
            <p className="text-lg mb-8" style={{ color: "var(--muted-b)" }}>
              Start free. Upgrade when you need more.
            </p>

            {/* Toggle */}
            <div
              className="inline-flex items-center rounded-xl p-1.5 gap-1"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  !annual ? "btn-primary" : ""
                }`}
                style={!annual ? {} : { color: "var(--muted-b)", background: "transparent" }}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  annual ? "btn-primary" : ""
                }`}
                style={annual ? {} : { color: "var(--muted-b)", background: "transparent" }}
              >
                Annual
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: annual ? "rgba(255,255,255,.2)" : "var(--green-pale)",
                    color: annual ? "#fff" : "var(--green)",
                  }}
                >
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 flex flex-col relative reveal ${
                  plan.highlight ? "" : ""
                }`}
                style={{
                  background: plan.dark ? "var(--accent)" : "var(--surface)",
                  border: plan.highlight
                    ? `2px solid var(--accent)`
                    : "1px solid var(--border)",
                  boxShadow: plan.highlight
                    ? "var(--sh-accent)"
                    : "var(--sh-sm)",
                  transform: plan.highlight ? "scale(1.02)" : "none",
                  color: plan.dark ? "#fff" : "var(--text)",
                }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className="px-4 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: "var(--accent-hov)" }}
                    >
                      Most popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm" style={{ color: plan.dark ? "rgba(255,255,255,.7)" : "var(--muted-b)" }}>
                    {plan.desc}
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5 mb-7">
                  <span className="text-4xl font-bold tracking-tight">
                    {annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.period && (
                    <span className="text-sm" style={{ color: plan.dark ? "rgba(255,255,255,.6)" : "var(--muted)" }}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{
                          background: plan.dark ? "rgba(255,255,255,.2)" : "var(--green-pale)",
                          color: plan.dark ? "#fff" : "var(--green)",
                        }}
                      >
                        ✓
                      </span>
                      <span style={{ color: plan.dark ? "rgba(255,255,255,.85)" : "var(--muted-b)" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${
                    plan.dark ? "" : "btn-primary"
                  }`}
                  style={
                    plan.dark
                      ? {
                          background: "#fff",
                          color: "var(--accent)",
                          fontWeight: 700,
                        }
                      : {}
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#09090e" }}
      >
        <div className="absolute inset-0 dot-grid" style={{ opacity: .25 }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(79,70,229,.12), transparent)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 py-28 text-center reveal">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase"
            style={{ background: "rgba(79,70,229,.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,.25)" }}
          >
            Ready to ship?
          </span>
          <h2
            className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight text-white tracking-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            Give your AI
            <br />
            <span className="grad-text-anim">a real memory.</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,.6)" }}>
            Sign up in 30 seconds. First 10,000 calls are free, forever.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-sm font-bold text-white btn-primary"
          >
            Get your free API key →
          </Link>
        </div>
      </section>

      {/* ══ Footer ══ */}
      <footer style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2.5" style={{ color: "var(--muted-b)" }}>
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "var(--accent)" }}
            >E</div>
            <span>
              © 2026 Engram · Built by{" "}
              <a
                href="https://github.com/VenkateswaraRao18"
                className="font-medium hover:text-gray-900 transition-colors"
                style={{ color: "var(--text-2)" }}
              >
                Venky Jannegorla
              </a>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm" style={{ color: "var(--muted-b)" }}>
            <Link href="/docs" className="hover:text-gray-900 transition-colors">Docs</Link>
            <a href="https://github.com/VenkateswaraRao18/Engram" className="hover:text-gray-900 transition-colors">
              GitHub
            </a>
            <a href="mailto:venkyjannegorla@gmail.com" className="hover:text-gray-900 transition-colors">
              Contact
            </a>
            <span className="flex items-center gap-1.5" style={{ color: "var(--green)" }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--green-b)" }} />
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
