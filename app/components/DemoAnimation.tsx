"use client";
import { useEffect, useState, useRef } from "react";

const STEPS = [
  { id: "type1",      delay: 600  },
  { id: "store1",     delay: 1800 },
  { id: "type2",      delay: 3200 },
  { id: "supersede",  delay: 4600 },
  { id: "search",     delay: 6200 },
  { id: "result",     delay: 7400 },
  { id: "done",       delay: 9200 },
];

const MSG1 = "I live in Tampa, FL";
const MSG2 = "I just moved from Tampa to Austin, TX";
const QUERY = "where does alice live?";

function useTyping(text: string, active: boolean, speed = 38) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    let i = 0;
    setDisplayed("");
    setDone(false);
    function next() {
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) ref.current = setTimeout(next, speed);
      else setDone(true);
    }
    ref.current = setTimeout(next, speed);
    return () => { if (ref.current) clearTimeout(ref.current); };
  }, [active, text, speed]);

  return { displayed, done };
}

export default function DemoAnimation() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function startDemo() {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setStep(-1);
    setRunning(true);

    STEPS.forEach((s) => {
      const t = setTimeout(() => setStep(STEPS.findIndex(x => x.id === s.id)), s.delay);
      timerRef.current.push(t);
    });

    // Auto-restart
    const restart = setTimeout(() => {
      setRunning(false);
      setStep(-1);
    }, 11000);
    timerRef.current.push(restart);
  }

  useEffect(() => {
    const t = setTimeout(startDemo, 800);
    return () => {
      clearTimeout(t);
      timerRef.current.forEach(clearTimeout);
    };
  }, []);

  const at = (id: string) => step >= STEPS.findIndex(s => s.id === id);

  const t1 = useTyping(MSG1, at("type1") && !at("store1"), 42);
  const t2 = useTyping(MSG2, at("type2") && !at("supersede"), 38);
  const tq = useTyping(QUERY, at("search") && !at("result"), 36);

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none">

      {/* Terminal window */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#07070f",
          border: "1px solid rgba(124,58,237,.25)",
          boxShadow: "0 0 80px rgba(124,58,237,.18), 0 32px 80px rgba(0,0,0,.8)",
        }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3.5"
          style={{ background: "rgba(255,255,255,.03)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#28ca41" }} />
          <span className="ml-4 text-xs font-mono" style={{ color: "rgba(255,255,255,.3)" }}>
            engram — supersession demo
          </span>
          <div className="ml-auto">
            <button
              onClick={startDemo}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: running ? "rgba(124,58,237,.15)" : "rgba(124,58,237,.25)",
                color: "#c4b5fd",
                border: "1px solid rgba(124,58,237,.3)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {running ? "running…" : "replay"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 font-mono text-sm space-y-5 min-h-[380px]">

          {/* ── Step 1: User message → Tampa ── */}
          <div
            className="transition-all duration-500"
            style={{ opacity: at("type1") ? 1 : 0, transform: at("type1") ? "translateY(0)" : "translateY(8px)" }}
          >
            <div className="flex items-start gap-2.5 mb-2">
              <span style={{ color: "#6366f1" }}>›</span>
              <span style={{ color: "rgba(255,255,255,.35)" }}>user says:</span>
            </div>
            <div className="ml-5 px-4 py-2.5 rounded-xl text-sm"
              style={{ background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.2)", color: "#a5b4fc" }}>
              &ldquo;{t1.displayed}<span
                className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                style={{ background: "#8b5cf6", opacity: at("store1") ? 0 : 1, animation: "pulse 1s infinite" }}
              />&rdquo;
            </div>
          </div>

          {/* ── Stored: Tampa ── */}
          <div
            className="transition-all duration-500"
            style={{ opacity: at("store1") ? 1 : 0, transform: at("store1") ? "translateY(0)" : "translateY(8px)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: "#34d399" }}>✓</span>
              <span style={{ color: "rgba(255,255,255,.35)" }}>POST /v1/memories → extracted:</span>
            </div>
            <div
              className="ml-5 flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-700"
              style={{
                background: at("supersede") ? "rgba(239,68,68,.08)" : "rgba(16,185,129,.08)",
                border: `1px solid ${at("supersede") ? "rgba(239,68,68,.2)" : "rgba(16,185,129,.2)"}`,
                opacity: at("supersede") ? 0.45 : 1,
              }}
            >
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0"
                style={{ background: "rgba(124,58,237,.2)", color: "#c4b5fd" }}>semantic</span>
              <span
                className="text-sm transition-all duration-700"
                style={{
                  color: at("supersede") ? "rgba(239,68,68,.7)" : "#6ee7b7",
                  textDecoration: at("supersede") ? "line-through" : "none",
                }}
              >
                User lives in Tampa, FL
              </span>
              {at("supersede") && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: "rgba(239,68,68,.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,.25)" }}>
                  superseded
                </span>
              )}
            </div>
          </div>

          {/* ── Step 2: User message → Austin ── */}
          <div
            className="transition-all duration-500"
            style={{ opacity: at("type2") ? 1 : 0, transform: at("type2") ? "translateY(0)" : "translateY(8px)" }}
          >
            <div className="flex items-start gap-2.5 mb-2">
              <span style={{ color: "#6366f1" }}>›</span>
              <span style={{ color: "rgba(255,255,255,.35)" }}>user says:</span>
            </div>
            <div className="ml-5 px-4 py-2.5 rounded-xl text-sm"
              style={{ background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.2)", color: "#a5b4fc" }}>
              &ldquo;{t2.displayed}<span
                className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                style={{ background: "#8b5cf6", opacity: at("supersede") ? 0 : 1, animation: "pulse 1s infinite" }}
              />&rdquo;
            </div>
          </div>

          {/* ── Superseded + Austin stored ── */}
          <div
            className="transition-all duration-700"
            style={{ opacity: at("supersede") ? 1 : 0, transform: at("supersede") ? "translateY(0)" : "translateY(8px)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: "#34d399" }}>✓</span>
              <span style={{ color: "rgba(255,255,255,.35)" }}>Tampa invalidated · Austin stored:</span>
            </div>
            <div className="ml-5 flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{ background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.2)" }}>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0"
                style={{ background: "rgba(124,58,237,.2)", color: "#c4b5fd" }}>semantic</span>
              <span className="text-sm" style={{ color: "#6ee7b7" }}>User lives in Austin, TX</span>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: "rgba(16,185,129,.15)", color: "#34d399", border: "1px solid rgba(16,185,129,.25)" }}>
                active
              </span>
            </div>
          </div>

          {/* ── Search query ── */}
          <div
            className="transition-all duration-500"
            style={{ opacity: at("search") ? 1 : 0, transform: at("search") ? "translateY(0)" : "translateY(8px)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: "#f59e0b" }}>›</span>
              <span style={{ color: "rgba(255,255,255,.35)" }}>GET /v1/memories/context?query=</span>
              <span style={{ color: "#fcd34d" }}>
                &quot;{tq.displayed}<span
                  className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                  style={{ background: "#f59e0b", opacity: at("result") ? 0 : 1 }}
                />&quot;
              </span>
            </div>
          </div>

          {/* ── Result: Austin only ── */}
          <div
            className="transition-all duration-700"
            style={{ opacity: at("result") ? 1 : 0, transform: at("result") ? "translateY(0)" : "translateY(8px)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: "#34d399" }}>✓</span>
              <span style={{ color: "rgba(255,255,255,.35)" }}>context returned:</span>
            </div>
            <div className="ml-5 px-4 py-3.5 rounded-xl"
              style={{ background: "rgba(16,185,129,.07)", border: "1px solid rgba(16,185,129,.18)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold" style={{ color: "#34d399" }}>
                  [semantic] User lives in Austin, TX
                </span>
                <span className="text-xs font-mono" style={{ color: "#34d399" }}>72%</span>
              </div>
              <div className="text-[11px] mt-2 pt-2" style={{ color: "rgba(255,255,255,.22)", borderTop: "1px solid rgba(255,255,255,.06)" }}>
                ✗ Tampa entry not returned — superseded at write time
              </div>
            </div>
          </div>

        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: "rgba(255,255,255,.04)" }}>
          <div
            className="h-full transition-all"
            style={{
              width: running ? `${((step + 1) / STEPS.length) * 100}%` : "0%",
              background: "linear-gradient(to right, #7c3aed, #3b82f6)",
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>

      {/* Caption */}
      <p className="text-center text-xs mt-4" style={{ color: "var(--muted)" }}>
        Tampa is invalidated at write time — not at read time. Your LLM always gets the truth.
      </p>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
