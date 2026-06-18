"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const PERKS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Temporal supersession",
    desc: "Stale facts auto-invalidated when users update them",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </svg>
    ),
    title: "Certainty filtering",
    desc: "Only definitive facts stored — no hearsay or guesses",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    title: "Multi-level memory",
    desc: "Session, user, and agent scopes in one API",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title: "Framework-ready",
    desc: "LangChain, CrewAI, and AutoGen integrations built in",
  },
];

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSuccess("Check your email to confirm your account, then sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>

      {/* ── Left panel (branding) ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 relative overflow-hidden p-12"
        style={{ background: "#09090e" }}
      >
        {/* Background gradients */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 60% at 20% 20%, rgba(79,70,229,.28), transparent),
              radial-gradient(ellipse 60% 40% at 80% 80%, rgba(37,99,235,.14), transparent)
            `,
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Decorative ring */}
        <div
          className="absolute -top-24 -right-24 anim-spin-s opacity-20"
          style={{
            width: 320, height: 320,
            border: "1px solid rgba(99,102,241,.5)",
            borderTopColor: "rgba(99,102,241,.9)",
            borderRadius: "50%",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "var(--accent)" }}
            >E</div>
            <span className="text-lg font-bold text-white">Engram</span>
          </Link>
        </div>

        {/* Middle */}
        <div className="relative z-10">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(79,70,229,.25)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,.25)" }}
          >
            Free · no credit card required
          </span>
          <h2
            className="text-3xl font-extrabold leading-tight mb-4 text-white tracking-tight"
            style={{ letterSpacing: "-0.025em" }}
          >
            The memory layer
            <br />
            <span style={{ color: "#a5b4fc" }}>your AI deserves.</span>
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,.6)" }}>
            Engram stores and retrieves memory that automatically stays up to date —
            no contradictions, no stale context.
          </p>

          <div className="space-y-4">
            {PERKS.map((p) => (
              <div key={p.title} className="flex items-start gap-3.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(79,70,229,.25)", color: "#a5b4fc" }}
                >
                  {p.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{p.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,.5)" }}>
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <div
            className="p-4 rounded-xl text-sm leading-relaxed italic"
            style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.65)" }}
          >
            &ldquo;The only memory API that doesn&apos;t return both Tampa and Austin when a user moves.
            Temporal supersession is the feature every AI app needs.&rdquo;
          </div>
          <p className="text-xs mt-2 text-right" style={{ color: "rgba(255,255,255,.3)" }}>
            — Early user feedback
          </p>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <div className="h-16 flex items-center justify-between px-8" style={{ borderBottom: "1px solid var(--border)" }}>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "var(--muted-b)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-b)")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to home
          </Link>

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "var(--accent)" }}
            >E</div>
            <span className="font-bold text-sm">Engram</span>
          </Link>

          <div className="text-sm" style={{ color: "var(--muted)" }}>
            {mode === "signup" ? "Already have an account? " : "Need an account? "}
            <button
              onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); setSuccess(""); }}
              className="font-semibold transition-colors"
              style={{ color: "var(--accent)" }}
            >
              {mode === "signup" ? "Sign in" : "Sign up free"}
            </button>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">

            {/* Heading */}
            <div className="mb-8 anim-fade-up">
              <h1
                className="text-2xl font-extrabold mb-2 tracking-tight"
                style={{ color: "var(--text)", letterSpacing: "-0.02em" }}
              >
                {mode === "signup" ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-sm" style={{ color: "var(--muted-b)" }}>
                {mode === "signup"
                  ? "Get your free API key in seconds. No credit card."
                  : "Sign in to your dashboard and API keys."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 anim-fade-up anim-d1">

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-2)" }}>
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input w-full px-4 py-3 text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="text-xs transition-colors"
                      style={{ color: "var(--accent)" }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Minimum 8 characters" : "Your password"}
                  className="input w-full px-4 py-3 text-sm"
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-start gap-3 p-3.5 rounded-xl text-sm anim-slide-d"
                  style={{
                    background: "var(--red-pale)",
                    border: "1px solid rgba(220,38,38,.2)",
                    color: "var(--red)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div
                  className="flex items-start gap-3 p-3.5 rounded-xl text-sm anim-slide-d"
                  style={{
                    background: "var(--green-pale)",
                    border: "1px solid rgba(5,150,105,.2)",
                    color: "var(--green)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="anim-spin-s">
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity=".25"/>
                      <path d="M21 12a9 9 0 00-9-9"/>
                    </svg>
                    Please wait…
                  </span>
                ) : mode === "signup" ? (
                  "Create free account →"
                ) : (
                  "Sign in to dashboard →"
                )}
              </button>
            </form>

            {/* Free tier trust signals (signup only) */}
            {mode === "signup" && (
              <div
                className="mt-6 flex items-center justify-between text-xs anim-fade-in anim-d2"
                style={{ color: "var(--muted)" }}
              >
                {[
                  "No credit card",
                  "10,000 free calls",
                  "Cancel anytime",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0 inline-block"
                      style={{ background: "var(--green-b)" }}
                    />
                    {t}
                  </span>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
