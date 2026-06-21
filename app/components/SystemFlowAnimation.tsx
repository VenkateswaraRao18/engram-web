"use client";
import { useEffect, useState, useRef, Fragment } from "react";

interface Step {
  conn: number;
  dir: "ltr" | "rtl";
  label: string;
  sub: string;
  dur: number;
}

const STEPS: Step[] = [
  { conn: 0, dir: "ltr", label: "User sends a message",   sub: '"Tell me about my project plan"',     dur: 1800 },
  { conn: 1, dir: "ltr", label: "Fetch relevant context", sub: "GET /v1/memories/context",             dur: 1400 },
  { conn: 2, dir: "ltr", label: "Vector search",          sub: "pgvector cosine similarity",            dur: 1200 },
  { conn: 2, dir: "rtl", label: "Top memories returned",  sub: "5 results · ~38ms latency",            dur: 1000 },
  { conn: 1, dir: "rtl", label: "Context injected",       sub: "prepended to LLM system prompt",        dur: 1000 },
  { conn: 0, dir: "rtl", label: "Personalized reply",     sub: "accurate · memory-aware response",      dur: 1600 },
  { conn: 1, dir: "ltr", label: "Store new memories",     sub: "POST /v1/memories",                     dur: 1200 },
  { conn: 2, dir: "ltr", label: "Supersede + persist",    sub: "slot-based overwrite · stale data gone", dur: 1000 },
];

const NODES = [
  { emoji: "👤", label: "User",       sub: "human or agent"       },
  { emoji: "🤖", label: "Your App",   sub: "LLM + logic"          },
  { emoji: "🧠", label: "Engram",     sub: "memory REST API"      },
  { emoji: "🗄️", label: "Memory",     sub: "Postgres + pgvector"  },
];

export default function SystemFlowAnimation() {
  const [si, setSi]       = useState(-1);
  const [running, setRun] = useState(false);
  const [tick, setTick]   = useState(0);
  const timers            = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clear() { timers.current.forEach(clearTimeout); timers.current = []; }

  function start() {
    clear();
    setSi(-1);
    setRun(true);
    setTick(t => t + 1);

    let elapsed = 500;
    STEPS.forEach((s, i) => {
      timers.current.push(setTimeout(() => setSi(i), elapsed));
      elapsed += s.dur;
    });
    timers.current.push(setTimeout(() => { setRun(false); setSi(-1); }, elapsed + 1600));
  }

  useEffect(() => {
    const t = setTimeout(start, 900);
    return () => { clearTimeout(t); clear(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cur = si >= 0 && si < STEPS.length ? STEPS[si] : null;

  return (
    <div className="w-full max-w-4xl mx-auto select-none">

      {/* ── Node row ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        {NODES.map((n, ni) => {
          const nodeOn = cur !== null && (cur.conn === ni || cur.conn === ni - 1);
          return (
            <Fragment key={ni}>
              {/* Node */}
              <div
                className="flex flex-col items-center gap-1.5 rounded-2xl shrink-0 transition-all duration-400"
                style={{
                  padding: "12px 14px",
                  minWidth: 78,
                  background:   nodeOn ? "rgba(124,58,237,.15)" : "rgba(255,255,255,.04)",
                  border:      `1px solid ${nodeOn ? "rgba(124,58,237,.45)" : "rgba(255,255,255,.07)"}`,
                  boxShadow:    nodeOn ? "0 0 28px rgba(124,58,237,.25)" : "none",
                  transition:  "all 0.35s ease",
                }}
              >
                <span className="text-2xl leading-none">{n.emoji}</span>
                <span className="text-[11px] font-bold whitespace-nowrap mt-0.5" style={{ color: "var(--text)" }}>
                  {n.label}
                </span>
                <span className="text-[9px] text-center leading-tight" style={{ color: "var(--muted)" }}>
                  {n.sub}
                </span>
              </div>

              {/* Connector */}
              {ni < NODES.length - 1 && (
                <div className="flex-1 relative mx-2" style={{ height: 24 }}>
                  {/* Track line */}
                  <div
                    className="absolute inset-x-0 overflow-hidden"
                    style={{ top: "50%", height: 2, transform: "translateY(-50%)" }}
                  >
                    <div className="absolute inset-0" style={{ background: "rgba(255,255,255,.07)" }} />
                    {cur && cur.conn === ni && (
                      <div
                        key={`${tick}-${si}-${ni}`}
                        className="absolute top-0 h-full"
                        style={{
                          width: "45%",
                          background: cur.dir === "ltr"
                            ? "linear-gradient(to right, transparent, #7c3aed, transparent)"
                            : "linear-gradient(to left, transparent, #7c3aed, transparent)",
                          animation: `sf-${cur.dir} ${Math.max(cur.dur - 400, 500)}ms linear forwards`,
                        }}
                      />
                    )}
                  </div>

                  {/* Active arrowhead */}
                  {cur && cur.conn === ni && (
                    <div
                      className="absolute"
                      style={{
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 0,
                        height: 0,
                        ...(cur.dir === "ltr"
                          ? {
                              right: 0,
                              borderTop: "5px solid transparent",
                              borderBottom: "5px solid transparent",
                              borderLeft: "7px solid #7c3aed",
                            }
                          : {
                              left: 0,
                              borderTop: "5px solid transparent",
                              borderBottom: "5px solid transparent",
                              borderRight: "7px solid #7c3aed",
                            }),
                      }}
                    />
                  )}

                  {/* Idle arrowhead */}
                  {(!cur || cur.conn !== ni) && (
                    <div
                      className="absolute"
                      style={{
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 0,
                        height: 0,
                        borderTop: "4px solid transparent",
                        borderBottom: "4px solid transparent",
                        borderLeft: "5px solid rgba(255,255,255,.1)",
                      }}
                    />
                  )}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      {/* ── Step label ───────────────────────────────────── */}
      <div className="text-center mt-7" style={{ minHeight: 44 }}>
        {cur ? (
          <div key={si} className="anim-scale-in">
            <p className="text-sm font-semibold" style={{ color: "#c4b5fd" }}>{cur.label}</p>
            <p className="text-xs mt-1 font-mono" style={{ color: "var(--muted)" }}>{cur.sub}</p>
          </div>
        ) : (
          !running && (
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Complete flow · auto-loops
            </p>
          )
        )}
      </div>

      {/* ── Step dots ────────────────────────────────────── */}
      <div className="flex justify-center gap-2 mt-4">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width:  i === si ? 20 : 6,
              height: 6,
              background: i === si ? "#7c3aed" : "rgba(255,255,255,.12)",
            }}
          />
        ))}
      </div>

      {/* ── Replay ───────────────────────────────────────── */}
      <div className="text-center mt-5">
        <button
          onClick={start}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: running ? "rgba(124,58,237,.1)" : "rgba(124,58,237,.2)",
            color: "#c4b5fd",
            border: "1px solid rgba(124,58,237,.3)",
          }}
        >
          {running ? (
            <>
              <span className="w-2 h-2 rounded-full" style={{ background: "#7c3aed", animation: "pulse 1s infinite" }} />
              running…
            </>
          ) : (
            <>▶ replay</>
          )}
        </button>
      </div>

      <style>{`
        @keyframes sf-ltr {
          from { transform: translateX(-100%); }
          to   { transform: translateX(350%); }
        }
        @keyframes sf-rtl {
          from { transform: translateX(350%); }
          to   { transform: translateX(-100%); }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
    </div>
  );
}
