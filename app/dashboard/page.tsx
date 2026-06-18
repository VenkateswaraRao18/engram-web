"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface KeyRecord {
  api_key: string;
  total_calls: number;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [keyRecord, setKeyRecord] = useState<KeyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }
      setUser({ email: user.email! });

      // Fetch API key from Supabase table
      const { data } = await supabase
        .from("api_keys")
        .select("api_key, total_calls, created_at")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setKeyRecord(data);
      } else {
        // First login — provision a key via your API server
        const res = await fetch("/api/provision-key", { method: "POST" });
        const d = await res.json();
        if (res.ok) {
          setKeyRecord(d);
        } else {
          console.error("provision-key failed:", res.status, d);
          alert(`Failed to provision API key: ${d.error ?? res.status}`);
        }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-sm" style={{ color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Navbar */}
      <nav className="border-b" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold" style={{ color: "var(--accent)" }}>Engram</span>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: "var(--muted)" }}>{user?.email}</span>
            <button onClick={signOut} className="text-sm hover:text-white transition-colors" style={{ color: "var(--muted)" }}>
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "API Calls", value: keyRecord?.total_calls?.toLocaleString() ?? "0" },
            { label: "Plan", value: "Free" },
            { label: "Calls remaining", value: keyRecord ? Math.max(0, 10000 - (keyRecord.total_calls ?? 0)).toLocaleString() : "10,000" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="text-2xl font-bold mb-1">{s.value}</div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* API Key */}
        <div className="rounded-xl border p-6 mb-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <h2 className="font-semibold mb-1">Your API Key</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            Include this in every request as the <code className="px-1 rounded" style={{ background: "var(--bg)", color: "var(--accent)" }}>X-API-Key</code> header.
          </p>
          <div className="flex items-center gap-3">
            <code
              className="flex-1 px-4 py-3 rounded-lg text-sm font-mono truncate"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              {keyRecord?.api_key ?? "Provisioning..."}
            </code>
            <button
              onClick={copyKey}
              className="px-4 py-3 rounded-lg text-sm font-medium transition-colors shrink-0"
              style={{ background: copied ? "#1f3f2a" : "var(--bg)", border: "1px solid var(--border)", color: copied ? "#4ade80" : "var(--text)" }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Quickstart */}
        <div className="rounded-xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <h2 className="font-semibold mb-4">Quick start</h2>
          <pre className="text-sm overflow-x-auto leading-relaxed p-4 rounded-lg" style={{ background: "var(--bg)", color: "#a78bfa", fontFamily: "var(--font-geist-mono)" }}>
{`import requests

KEY = "${keyRecord?.api_key ?? "your_api_key"}"
BASE = "https://api.engram.dev"

# Add a memory
requests.post(f"{BASE}/v1/memories",
  headers={"X-API-Key": KEY},
  json={"messages": [{"role": "user", "content": "I live in Tampa"}], "user_id": "u1"}
)

# Search
ctx = requests.get(f"{BASE}/v1/memories/context",
  headers={"X-API-Key": KEY},
  params={"query": "where does user live", "user_id": "u1"}
).json()["context"]`}
          </pre>
        </div>
      </main>
    </div>
  );
}
