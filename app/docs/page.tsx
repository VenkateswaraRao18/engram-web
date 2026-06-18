import Link from "next/link";

const ENDPOINTS = [
  {
    method: "POST",
    path: "/v1/memories",
    desc: "Extract and store memories from a conversation turn.",
    request: `{
  "messages": [
    {"role": "user", "content": "I live in Tampa, Florida."},
    {"role": "assistant", "content": "Got it!"}
  ],
  "user_id": "user-123"
}`,
    response: `{
  "memories": [
    {
      "id": "mem_abc123",
      "content": "User lives in Tampa, Florida.",
      "memory_type": "semantic",
      "importance": 0.85,
      "created_at": "2026-06-18T10:00:00"
    }
  ],
  "count": 1
}`,
  },
  {
    method: "GET",
    path: "/v1/memories/search",
    desc: "Search for relevant memories by semantic query.",
    request: `GET /v1/memories/search
  ?query=where does the user live
  &user_id=user-123
  &k=5`,
    response: `{
  "results": [
    {
      "memory": { "content": "User lives in Tampa, Florida.", ... },
      "score": 0.94,
      "retrieval_path": "vector"
    }
  ],
  "count": 1
}`,
  },
  {
    method: "GET",
    path: "/v1/memories/context",
    desc: "Get a formatted context string ready to inject into your LLM prompt.",
    request: `GET /v1/memories/context
  ?query=tell me about the user
  &user_id=user-123
  &max_tokens=800`,
    response: `{
  "context": "- [semantic] User lives in Tampa, Florida.\\n- [semantic] User is a software engineer.",
  "user_id": "user-123"
}`,
  },
  {
    method: "DELETE",
    path: "/v1/memories/{memory_id}",
    desc: "Delete a specific memory by ID.",
    request: `DELETE /v1/memories/mem_abc123`,
    response: `204 No Content`,
  },
  {
    method: "DELETE",
    path: "/v1/users/{user_id}/memories",
    desc: "Delete all memories for a user.",
    request: `DELETE /v1/users/user-123/memories`,
    response: `204 No Content`,
  },
  {
    method: "GET",
    path: "/v1/users/{user_id}/stats",
    desc: "Get memory count statistics for a user.",
    request: `GET /v1/users/user-123/stats`,
    response: `{
  "user_id": "user-123",
  "total_memories": 42
}`,
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "#4ade80",
  POST: "#60a5fa",
  DELETE: "#f87171",
};

export default function Docs() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: "var(--border)", background: "rgba(10,10,15,0.9)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold" style={{ color: "var(--accent)" }}>Engram</Link>
          <Link href="/auth" className="text-sm px-4 py-2 rounded-lg font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
            Get API key
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">API Reference</h1>
        <p className="text-lg mb-10" style={{ color: "var(--muted)" }}>
          All requests require an <code className="px-1.5 py-0.5 rounded text-sm" style={{ background: "var(--surface)", color: "var(--accent)" }}>X-API-Key</code> header.
          Base URL: <code className="px-1.5 py-0.5 rounded text-sm" style={{ background: "var(--surface)", color: "var(--text)" }}>https://api.engram.dev</code>
        </p>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Authentication</h2>
          <div className="rounded-xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Include your API key in every request header:
            </p>
            <pre className="text-sm p-4 rounded-lg overflow-x-auto" style={{ background: "var(--bg)", color: "#a78bfa", fontFamily: "var(--font-geist-mono)" }}>
{`curl https://api.engram.dev/v1/memories/search \\
  -H "X-API-Key: engrm_your_key_here" \\
  -G -d "query=where does user live" -d "user_id=u1"`}
            </pre>
          </div>
        </section>

        {/* Endpoints */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Endpoints</h2>
          <div className="space-y-6">
            {ENDPOINTS.map(ep => (
              <div key={ep.path} className="rounded-xl border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
                  <span className="text-xs font-bold px-2 py-1 rounded font-mono" style={{ background: "var(--bg)", color: METHOD_COLORS[ep.method] }}>
                    {ep.method}
                  </span>
                  <code className="font-mono text-sm">{ep.path}</code>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>{ep.desc}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--muted)" }}>Request</div>
                      <pre className="text-xs p-3 rounded-lg overflow-x-auto" style={{ background: "var(--bg)", color: "#e2e2f0", fontFamily: "var(--font-geist-mono)" }}>
                        {ep.request}
                      </pre>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--muted)" }}>Response</div>
                      <pre className="text-xs p-3 rounded-lg overflow-x-auto" style={{ background: "var(--bg)", color: "#4ade80", fontFamily: "var(--font-geist-mono)" }}>
                        {ep.response}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Providers */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Supported LLM Providers</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "Gemini", models: "gemini-2.5-flash, gemini-1.5-pro", badge: "Default" },
              { name: "OpenAI", models: "gpt-4o-mini, gpt-4o", badge: "" },
              { name: "Anthropic", models: "claude-haiku-4-5, claude-sonnet-4-6", badge: "" },
              { name: "Ollama", models: "llama3.1, mistral, any local model", badge: "Self-hosted" },
            ].map(p => (
              <div key={p.name} className="rounded-xl border p-5" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{p.name}</span>
                  {p.badge && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(124,106,247,0.15)", color: "var(--accent)" }}>{p.badge}</span>}
                </div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{p.models}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
