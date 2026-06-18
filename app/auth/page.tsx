"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

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
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Check your email to confirm your account, then log in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <Link href="/" className="flex justify-center mb-8 text-xl font-bold" style={{ color: "var(--accent)" }}>
          Engram
        </Link>

        <div className="rounded-xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <h1 className="text-xl font-bold mb-1">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            {mode === "signup" ? "Get your free API key in seconds." : "Sign in to your dashboard."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-green-400">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--accent)" }}
            >
              {loading ? "..." : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--muted)" }}>
            {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="hover:text-white transition-colors"
              style={{ color: "var(--accent)" }}
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
