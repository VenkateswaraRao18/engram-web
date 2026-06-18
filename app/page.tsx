"use client";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "#pricing" },
];

const PROBLEM_CODE = `# What happens today (append-only memory)
memory.add("I live in Tampa")     # stored ✓
memory.add("I moved to Austin")   # also stored ✓

memory.search("where do I live?")
# → "Tampa" and "Austin" — both returned
# → Your LLM is confused`;

const SOLUTION_CODE = `# What Engram does (temporal supersession)
memory.add("I live in Tampa")     # stored ✓
memory.add("I moved to Austin")   # Tampa auto-invalidated ✓

memory.search("where do I live?")
# → "Austin" only — always correct`;

const QUICKSTART_CODE = `import requests

BASE = "https://api.engram.dev"
KEY  = "engrm_your_api_key"

# Store a memory
requests.post(f"{BASE}/v1/memories",
  headers={"X-API-Key": KEY},
  json={
    "messages": [{"role": "user", "content": "I live in Tampa, FL"}],
    "user_id": "user-123"
  }
)

# User moves — old memory auto-invalidated
requests.post(f"{BASE}/v1/memories",
  headers={"X-API-Key": KEY},
  json={
    "messages": [{"role": "user", "content": "I just moved to Austin!"}],
    "user_id": "user-123"
  }
)

# Get context for your LLM — returns Austin only
ctx = requests.get(f"{BASE}/v1/memories/context",
  headers={"X-API-Key": KEY},
  params={"query": "where does user live", "user_id": "user-123"}
).json()["context"]`;

const FEATURES = [
  {
    icon: "⚡",
    title: "Temporal Supersession",
    desc: "When a fact changes, the old version is automatically invalidated. No stale data, no conflicting context.",
  },
  {
    icon: "🔍",
    title: "Hybrid Retrieval",
    desc: "Vector search + knowledge graph fused via Reciprocal Rank Fusion. More relevant results than vector-only.",
  },
  {
    icon: "🧠",
    title: "Tense-Aware Extraction",
    desc: '"I\'m moving to Austin next month" does NOT supersede Tampa. Only completed moves trigger updates.',
  },
  {
    icon: "🔌",
    title: "Any LLM Provider",
    desc: "Works with OpenAI, Anthropic, Gemini, or Ollama. Bring your own key or use ours.",
  },
  {
    icon: "🚀",
    title: "Zero Infrastructure",
    desc: "No vector DB to manage. No graph DB to set up. One API endpoint does everything.",
  },
  {
    icon: "📊",
    title: "Usage Dashboard",
    desc: "See every API call, latency, and memory count per user in real time.",
  },
];

const COMPARISON = [
  { feature: "Vector search", engram: true, mem0: true, zep: true, raw: true },
  { feature: "Knowledge graph", engram: true, mem0: "partial", zep: true, raw: false },
  { feature: "Temporal supersession", engram: true, mem0: false, zep: false, raw: false },
  { feature: "Tense-aware extraction", engram: true, mem0: false, zep: false, raw: false },
  { feature: "Hybrid RRF retrieval", engram: true, mem0: false, zep: false, raw: false },
  { feature: "Hosted API", engram: true, mem0: true, zep: true, raw: false },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["10,000 API calls/month", "Up to 1,000 memories", "Gemini extraction", "Community support"],
    cta: "Get started",
    href: "/auth",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: ["500,000 API calls/month", "Unlimited memories", "Any LLM provider", "Email support", "Usage analytics"],
    cta: "Start free trial",
    href: "/auth",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Unlimited everything", "Dedicated infra", "SLA guarantee", "Slack support", "Custom models"],
    cta: "Contact us",
    href: "mailto:venkyjannegorla@gmail.com",
    highlight: false,
  },
];

function Check() {
  return <span className="text-purple-400 font-bold">✓</span>;
}
function Cross() {
  return <span className="text-gray-600">✗</span>;
}
function Partial() {
  return <span className="text-yellow-500">~</span>;
}

function Cell({ val }: { val: boolean | string }) {
  if (val === true) return <Check />;
  if (val === false) return <Cross />;
  return <Partial />;
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Navbar */}
      <nav className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: "var(--border)", background: "rgba(10,10,15,0.8)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold" style={{ color: "var(--accent)" }}>Engram</span>
          <div className="flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="text-sm hover:text-white transition-colors" style={{ color: "var(--muted)" }}>
                {l.label}
              </Link>
            ))}
            <Link href="/auth" className="text-sm px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90" style={{ background: "var(--accent)", color: "#fff" }}>
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8 border" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          Open source library · Hosted API
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          AI memory that knows{" "}
          <span style={{ background: "linear-gradient(135deg, #7c6af7, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            what&apos;s currently true
          </span>
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: "var(--muted)" }}>
          Most memory systems are append-only. When facts change, old versions pile up and confuse your LLM.
          Engram automatically invalidates stale facts — one API call away.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth" className="px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--accent)" }}>
            Start for free
          </Link>
          <Link href="/docs" className="px-8 py-3 rounded-lg font-semibold border transition-colors hover:bg-white/5" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            View docs →
          </Link>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">The problem with every other memory system</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl p-6 border" style={{ background: "var(--surface)", borderColor: "#3f1f1f" }}>
            <div className="flex items-center gap-2 mb-4 text-red-400 font-semibold">
              <span>✗</span> Without Engram
            </div>
            <pre className="text-sm leading-relaxed overflow-x-auto" style={{ color: "#f87171", fontFamily: "var(--font-geist-mono)" }}>
              {PROBLEM_CODE}
            </pre>
          </div>
          <div className="rounded-xl p-6 border" style={{ background: "var(--surface)", borderColor: "#1f3f2a" }}>
            <div className="flex items-center gap-2 mb-4 text-green-400 font-semibold">
              <span>✓</span> With Engram
            </div>
            <pre className="text-sm leading-relaxed overflow-x-auto" style={{ color: "#4ade80", fontFamily: "var(--font-geist-mono)" }}>
              {SOLUTION_CODE}
            </pre>
          </div>
        </div>
      </section>

      {/* Quickstart */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Up and running in 5 minutes</h2>
        <p className="text-center mb-10" style={{ color: "var(--muted)" }}>No database to set up. No infrastructure to manage. Just call the API.</p>
        <div className="rounded-xl p-6 border overflow-x-auto" style={{ background: "#0d0d16", borderColor: "var(--border)" }}>
          <pre className="text-sm leading-relaxed" style={{ color: "#a78bfa", fontFamily: "var(--font-geist-mono)" }}>
            {QUICKSTART_CODE}
          </pre>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything your AI app needs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="rounded-xl p-6 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How Engram compares</h2>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--surface)", borderBottom: `1px solid var(--border)` }}>
                <th className="text-left px-6 py-4 font-semibold">Feature</th>
                <th className="px-4 py-4 font-semibold" style={{ color: "var(--accent)" }}>Engram</th>
                <th className="px-4 py-4 font-semibold" style={{ color: "var(--muted)" }}>Mem0</th>
                <th className="px-4 py-4 font-semibold" style={{ color: "var(--muted)" }}>Zep</th>
                <th className="px-4 py-4 font-semibold" style={{ color: "var(--muted)" }}>Raw vector</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.feature} style={{ borderTop: i > 0 ? `1px solid var(--border)` : undefined }}>
                  <td className="px-6 py-4" style={{ color: "var(--text)" }}>{row.feature}</td>
                  <td className="px-4 py-4 text-center"><Cell val={row.engram} /></td>
                  <td className="px-4 py-4 text-center"><Cell val={row.mem0} /></td>
                  <td className="px-4 py-4 text-center"><Cell val={row.zep} /></td>
                  <td className="px-4 py-4 text-center"><Cell val={row.raw} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-center mb-12" style={{ color: "var(--muted)" }}>Start free. Scale as you grow.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map(plan => (
            <div
              key={plan.name}
              className="rounded-xl p-6 border flex flex-col"
              style={{
                background: plan.highlight ? "rgba(124,106,247,0.08)" : "var(--surface)",
                borderColor: plan.highlight ? "var(--accent)" : "var(--border)",
              }}
            >
              {plan.highlight && (
                <div className="text-xs font-semibold px-3 py-1 rounded-full self-start mb-4" style={{ background: "var(--accent)", color: "#fff" }}>
                  Most popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span style={{ color: "var(--muted)" }}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span style={{ color: "var(--accent)" }}>✓</span>
                    <span style={{ color: "var(--muted)" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className="block text-center py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: plan.highlight ? "var(--accent)" : "transparent",
                  color: plan.highlight ? "#fff" : "var(--text)",
                  border: plan.highlight ? "none" : `1px solid var(--border)`,
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to give your AI a real memory?</h2>
        <p className="mb-8 text-lg" style={{ color: "var(--muted)" }}>
          Sign up in 30 seconds. Your first 10,000 calls are free.
        </p>
        <Link href="/auth" className="px-10 py-4 rounded-lg font-semibold text-white text-lg inline-block transition-opacity hover:opacity-90" style={{ background: "var(--accent)" }}>
          Get your API key →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm" style={{ color: "var(--muted)" }}>
          <span>© 2026 Engram. Built by <a href="https://github.com/VenkateswaraRao18" className="hover:text-white transition-colors">Venky Jannegorla</a>.</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <a href="https://github.com/VenkateswaraRao18/Engram" className="hover:text-white transition-colors">GitHub</a>
            <a href="mailto:venkyjannegorla@gmail.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
