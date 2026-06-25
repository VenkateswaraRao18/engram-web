"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const PERKS = [
  {
    gradient: "linear-gradient(135deg,#7c3aed,#6366f1)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    title: "Temporal supersession",
    desc: "Stale facts are auto-invalidated when users update them — never contradictory.",
  },
  {
    gradient: "linear-gradient(135deg,#2563eb,#3b82f6)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    title: "Certainty filtering",
    desc: "Only definitive facts stored — hearsay and guesses are discarded.",
  },
  {
    gradient: "linear-gradient(135deg,#059669,#10b981)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    title: "Multi-level memory",
    desc: "Session, user, and agent scopes in one simple API call.",
  },
  {
    gradient: "linear-gradient(135deg,#be185d,#ec4899)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
    title: "Framework-ready",
    desc: "LangChain, CrewAI, and AutoGen integrations built in.",
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
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

      {/* ── Left branding panel ─────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 relative overflow-hidden p-12"
        style={{ background: "#06060d", borderRight: "1px solid var(--border)" }}
      >
        {/* Orbs */}
        <div className="orb anim-orb" style={{ width: 500, height: 500, top: -100, left: -100, background: "radial-gradient(circle,#7c3aed,transparent 70%)", opacity: .16 }} />
        <div className="orb" style={{ width: 300, height: 300, bottom: 50, right: -50, background: "radial-gradient(circle,#3b82f6,transparent 70%)", opacity: .10 }} />

        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid" style={{ opacity: .3 }} />

        {/* Spinning ring */}
        <div
          className="absolute -top-20 -right-20 anim-spin-s"
          style={{ width: 320, height: 320, border: "1px solid rgba(124,58,237,.2)", borderTopColor: "rgba(124,58,237,.7)", borderRadius: "50%", opacity: .5 }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 24px rgba(124,58,237,.5)" }}
            >E</div>
            <span className="text-lg font-bold" style={{ color: "var(--text)" }}>Engram</span>
          </Link>
        </div>

        {/* Middle content */}
        <div className="relative z-10">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(124,58,237,.18)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,.28)" }}
          >
            Free · no credit card required
          </div>
          <h2
            className="text-3xl font-extrabold leading-tight mb-4 tracking-tight"
            style={{ color: "var(--text)", letterSpacing: "-0.03em" }}
          >
            The memory layer
            <br />
            <span className="grad-text-anim">your AI deserves.</span>
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--muted-b)" }}>
            Engram stores and retrieves memory that automatically stays up to date — no contradictions, no stale context.
          </p>

          <div className="space-y-4">
            {PERKS.map((p) => (
              <div key={p.title} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-white"
                  style={{ background: p.gradient, boxShadow: `0 4px 16px rgba(0,0,0,.3)` }}
                >
                  {p.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>{p.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <div
            className="p-4 rounded-xl text-sm leading-relaxed italic"
            style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border)", color: "var(--muted-b)" }}
          >
            &ldquo;The only memory API that doesn&apos;t return both Tampa and Austin when a user moves. Temporal supersession is the feature every AI app needs.&rdquo;
          </div>
          <p className="text-xs mt-2 text-right" style={{ color: "var(--muted)" }}>— Early user feedback</p>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 dot-grid pointer-events-none" style={{ opacity: .15 }} />
        <div className="orb" style={{ width: 400, height: 400, top: -80, right: -80, background: "radial-gradient(circle,#4f46e5,transparent 70%)", opacity: .06 }} />

        {/* Top bar */}
        <div className="h-16 flex items-center justify-between px-8 relative z-10" style={{ borderBottom: "1px solid var(--border)" }}>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "var(--muted-b)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--muted-b)")}
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
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
            >E</div>
            <span className="font-bold text-sm" style={{ color: "var(--text)" }}>Engram</span>
          </Link>

          <div className="text-sm" style={{ color: "var(--muted)" }}>
            {mode === "signup" ? "Already have an account? " : "Need an account? "}
            <button
              onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); setSuccess(""); }}
              className="font-semibold transition-colors"
              style={{ color: "#c4b5fd" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-soft)")}
              onMouseLeave={e => (e.currentTarget.style.color = "#c4b5fd")}
            >
              {mode === "signup" ? "Sign in" : "Sign up free"}
            </button>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-12 relative z-10">
          <div className="w-full max-w-sm">

            {/* Glass card container */}
            <div
              className="rounded-2xl p-8 anim-scale-in"
              style={{
                background: "rgba(255,255,255,0.038)",
                border: "1px solid var(--border-b)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 24px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04)",
              }}
            >
              {/* Heading */}
              <div className="mb-7 anim-fade-up">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-4"
                  style={{ background: "var(--accent-pale)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,.25)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full anim-pulse-dot" style={{ background: "#8b5cf6" }} />
                  {mode === "signup" ? "Free account" : "Welcome back"}
                </div>
                <h1
                  className="text-2xl font-extrabold mb-2"
                  style={{ color: "var(--text)", letterSpacing: "-0.025em" }}
                >
                  {mode === "signup" ? "Create your account" : "Sign in to Engram"}
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
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--muted-b)" }}>
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
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-b)" }}>Password</label>
                    {mode === "login" && (
                      <button type="button" className="text-xs font-medium" style={{ color: "#c4b5fd" }}>
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
                    style={{ background: "var(--red-pale)", border: "1px solid rgba(239,68,68,.2)", color: "#fca5a5" }}
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
                    style={{ background: "var(--green-pale)", border: "1px solid rgba(16,185,129,.2)", color: "#34d399" }}
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
                  ) : mode === "signup" ? "Create free account →" : "Sign in to dashboard →"}
                </button>
              </form>

              {/* Trust signals */}
              {mode === "signup" && (
                <div className="mt-5 pt-5 border-t flex items-center justify-between text-xs anim-fade-in anim-d2" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
                  {["No credit card", "10,000 free calls", "Cancel anytime"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 inline-block" style={{ background: "var(--green-b)" }} />
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
