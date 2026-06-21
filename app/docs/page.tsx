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
    method: "POST",
    path: "/v1/memories/search/batch",
    desc: "Search up to 20 queries in a single request. Returns a map of query → results.",
    request: `{
  "queries": [
    "where does the user live?",
    "what is the user's job?"
  ],
  "user_id": "user-123",
  "k": 5
}`,
    response: `{
  "results": {
    "where does the user live?": [
      { "memory": { "content": "User lives in Austin, TX." }, "score": 0.96 }
    ],
    "what is the user's job?": [
      { "memory": { "content": "User is a Senior Engineer." }, "score": 0.91 }
    ]
  },
  "count": 2
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
    method: "PATCH",
    path: "/v1/memories/{memory_id}",
    desc: "Edit a memory's content and/or importance. Re-embeds automatically if content changes.",
    request: `PATCH /v1/memories/mem_abc123
Content-Type: application/json

{
  "content": "User lives in Austin, TX.",
  "importance": 0.92
}`,
    response: `{
  "id": "mem_abc123",
  "content": "User lives in Austin, TX.",
  "memory_type": "semantic",
  "importance": 0.92,
  ...
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
  {
    method: "GET",
    path: "/v1/users/{user_id}/health",
    desc: "Memory health check — returns counts of active, superseded, expired, and ghost (missing embedding) records.",
    request: `GET /v1/users/user-123/health`,
    response: `{
  "user_id": "user-123",
  "active": 38,
  "superseded": 7,
  "expired": 2,
  "ghost": 0,
  "status": "healthy"
}`,
  },
  {
    method: "GET",
    path: "/v1/memories/about/{person}",
    desc: "Retrieve memories about a specific third party (e.g. 'john', 'mom').",
    request: `GET /v1/memories/about/john
  ?user_id=user-123
  &query=work
  &k=5`,
    response: `{
  "person": "john",
  "results": [
    { "memory": { "content": "John is user's manager." }, "score": 0.88 }
  ],
  "count": 1
}`,
  },
  {
    method: "GET",
    path: "/v1/users/{user_id}/export",
    desc: "Export all memories for a user (GDPR / data portability).",
    request: `GET /v1/users/user-123/export
  ?include_superseded=false`,
    response: `{
  "user_id": "user-123",
  "total": 42,
  "exported_at": "2026-06-20T10:00:00",
  "memories": [ ... ]
}`,
  },
  {
    method: "POST",
    path: "/v1/users/{user_id}/compress",
    desc: "Compress semantically similar memories into concise summaries. Only runs when total exceeds the compression threshold.",
    request: `POST /v1/users/user-123/compress`,
    response: `{
  "user_id": "user-123",
  "removed": 8,
  "message": "Compressed 8 memories into summaries."
}`,
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET:    "#4ade80",
  POST:   "#60a5fa",
  PATCH:  "#fbbf24",
  DELETE: "#f87171",
};

export default function Docs() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav
        className="border-b sticky top-0 z-50 backdrop-blur-sm"
        style={{ borderColor: "var(--border)", background: "rgba(10,10,15,0.9)" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold" style={{ color: "var(--accent)" }}>Engram</Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors"
              style={{ color: "rgba(255,255,255,.55)" }}
            >
              Dashboard
            </Link>
            <Link
              href="/auth"
              className="text-sm px-4 py-2 rounded-lg font-medium"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Get API key
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">API Reference</h1>
          <p className="text-lg mb-2" style={{ color: "var(--muted)" }}>
            All requests require an{" "}
            <code
              className="px-1.5 py-0.5 rounded text-sm"
              style={{ background: "var(--surface)", color: "var(--accent)" }}
            >
              X-API-Key
            </code>{" "}
            header.
          </p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Base URL:{" "}
            <code
              className="px-1.5 py-0.5 rounded text-sm"
              style={{ background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-geist-mono)" }}
            >
              https://engram-api-venky.fly.dev
            </code>
          </p>
        </div>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Authentication</h2>
          <div
            className="rounded-xl border p-6"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Include your API key in every request header:
            </p>
            <pre
              className="text-sm p-4 rounded-lg overflow-x-auto"
              style={{ background: "var(--bg)", color: "#a78bfa", fontFamily: "var(--font-geist-mono)" }}
            >
{`curl https://engram-api-venky.fly.dev/v1/memories/search \\
  -H "X-API-Key: engrm_your_key_here" \\
  -G -d "query=where does user live" -d "user_id=u1"`}
            </pre>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>Endpoint</th>
                  <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>Limit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { path: "POST /v1/memories",  limit: "60 / minute" },
                  { path: "GET  /v1/memories/*", limit: "120 / minute" },
                  { path: "POST /v1/memories/search/batch", limit: "30 / minute" },
                  { path: "DELETE endpoints",    limit: "60 / minute" },
                  { path: "POST /compress, GET /export", limit: "5 / minute" },
                ].map((r, i) => (
                  <tr
                    key={r.path}
                    style={{
                      borderTop: i > 0 ? "1px solid var(--border)" : undefined,
                      background: i % 2 === 0 ? "var(--surface)" : "var(--bg-subtle)",
                    }}
                  >
                    <td className="px-5 py-3">
                      <code style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "var(--text-2)" }}>
                        {r.path}
                      </code>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium" style={{ color: "var(--accent)" }}>
                      {r.limit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Endpoints */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Endpoints</h2>
          <div className="space-y-5">
            {ENDPOINTS.map((ep) => (
              <div
                key={ep.method + ep.path}
                className="rounded-xl border"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div
                  className="px-6 py-4 border-b flex items-center gap-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{
                      background: "var(--bg)",
                      color: METHOD_COLORS[ep.method] ?? "#9ca3af",
                      fontFamily: "var(--font-geist-mono)",
                    }}
                  >
                    {ep.method}
                  </span>
                  <code className="font-mono text-sm" style={{ color: "var(--text)" }}>
                    {ep.path}
                  </code>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm mb-4" style={{ color: "var(--muted-b)" }}>
                    {ep.desc}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div
                        className="text-xs font-semibold mb-2 uppercase tracking-wide"
                        style={{ color: "var(--muted)" }}
                      >
                        Request
                      </div>
                      <pre
                        className="text-xs p-3 rounded-lg overflow-x-auto"
                        style={{
                          background: "var(--bg)",
                          color: "#e2e2f0",
                          fontFamily: "var(--font-geist-mono)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {ep.request}
                      </pre>
                    </div>
                    <div>
                      <div
                        className="text-xs font-semibold mb-2 uppercase tracking-wide"
                        style={{ color: "var(--muted)" }}
                      >
                        Response
                      </div>
                      <pre
                        className="text-xs p-3 rounded-lg overflow-x-auto"
                        style={{
                          background: "var(--bg)",
                          color: "#4ade80",
                          fontFamily: "var(--font-geist-mono)",
                          border: "1px solid var(--border)",
                        }}
                      >
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
              { name: "Gemini",    models: "gemini-2.5-flash, gemini-1.5-pro",         badge: "Default" },
              { name: "OpenAI",    models: "gpt-4o-mini, gpt-4o",                       badge: "Fallback" },
              { name: "Anthropic", models: "claude-haiku-4-5, claude-sonnet-4-6",       badge: "" },
              { name: "Ollama",    models: "llama3.1, mistral, any local model",        badge: "Self-hosted" },
            ].map((p) => (
              <div
                key={p.name}
                className="rounded-xl border p-5"
                style={{ background: "var(--bg)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold" style={{ color: "var(--text)" }}>{p.name}</span>
                  {p.badge && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(124,106,247,0.15)", color: "var(--accent)" }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{p.models}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Memory Types */}
        <section className="mt-12 mb-12">
          <h2 className="text-2xl font-bold mb-6">Memory Types</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                type: "semantic",
                color: "var(--accent)",
                bg: "var(--accent-pale)",
                desc: "Current-state facts. Slot-based supersession keeps only the latest value per subject+slot pair.",
                example: `"User lives in Austin, TX."`,
              },
              {
                type: "episodic",
                color: "var(--blue)",
                bg: "var(--blue-pale)",
                desc: "Historical events and experiences. Multiple episodics for the same event are deduplicated by similarity.",
                example: `"User ran the Boston Marathon in 3h 42m."`,
              },
              {
                type: "procedural",
                color: "var(--green)",
                bg: "var(--green-pale)",
                desc: "Habits, skills, and learned behaviors. Never superseded — accumulated over time.",
                example: `"User prefers concise bullet-point answers."`,
              },
            ].map((m) => (
              <div
                key={m.type}
                className="rounded-xl border p-5"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <span
                  className="inline-block text-xs font-bold px-2.5 py-1 rounded-lg mb-3"
                  style={{ background: m.bg, color: m.color, fontFamily: "var(--font-geist-mono)" }}
                >
                  {m.type}
                </span>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--muted-b)" }}>
                  {m.desc}
                </p>
                <code
                  className="text-xs block p-2 rounded-lg"
                  style={{ background: "var(--bg-subtle)", color: "var(--text-2)", fontFamily: "var(--font-geist-mono)" }}
                >
                  {m.example}
                </code>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
