/**
 * RescueTerminal.tsx
 *
 * Frosted-glass QA terminal overlay that plays an auto-typed debugging log
 * sequence when the "healing" phase is active. After the full script
 * completes it calls `completeHeal()` to transition the sandbox to "verified".
 *
 * Design language: warm cream glassmorphism — consistent with the portfolio's
 * soft warm-tones palette while evoking a professional dev-ops terminal.
 *
 * Z-index: 10005 (above physics canvas 9998, below crash toast 10007)
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, CheckCircle, Minus, X } from "lucide-react";
import { useCompleteHeal } from "@/lib/sandbox-store";

// ---------------------------------------------------------------------------
// Script definition
// ---------------------------------------------------------------------------

type LogType = "info" | "warn" | "proc" | "fix" | "test" | "pass" | "done";

interface ScriptEntry {
  prefix: string;
  text: string;
  /** ms to wait AFTER this line finishes before typing the next one */
  pauseAfter: number;
  type: LogType;
}

const SCRIPT: ScriptEntry[] = [
  {
    prefix: "INIT",
    text: "Auto-Healing Pipeline v2.3.1 — starting recovery sequence...",
    pauseAfter: 320,
    type: "info",
  },
  {
    prefix: "SCAN",
    text: "Collecting live DOM snapshot... 247 nodes indexed",
    pauseAfter: 280,
    type: "info",
  },
  {
    prefix: "WARN",
    text: "Critical: 6 elements detected in free-fall state",
    pauseAfter: 200,
    type: "warn",
  },
  {
    prefix: "WARN",
    text: "CSS layout engine: UNRESPONSIVE — grid collapsed",
    pauseAfter: 380,
    type: "warn",
  },
  {
    prefix: "PROC",
    text: "Injecting correction vectors into physics world...",
    pauseAfter: 500,
    type: "proc",
  },
  {
    prefix: "PROC",
    text: "Recalculating flex/grid boundary constraints...",
    pauseAfter: 420,
    type: "proc",
  },
  {
    prefix: "PROC",
    text: "Catching falling DOM nodes... [████████░░] 80%",
    pauseAfter: 560,
    type: "proc",
  },
  {
    prefix: "FIX ",
    text: "Anchoring orphaned elements back to DOM tree...",
    pauseAfter: 360,
    type: "fix",
  },
  {
    prefix: "FIX ",
    text: "Restoring z-index stratification layers...",
    pauseAfter: 440,
    type: "fix",
  },
  {
    prefix: "TEST",
    text: "Executing layout regression suite (12 assertions)...",
    pauseAfter: 300,
    type: "test",
  },
  {
    prefix: "PASS",
    text: "Hero section integrity.............. ✓ PASS",
    pauseAfter: 160,
    type: "pass",
  },
  {
    prefix: "PASS",
    text: "Grid layout boundaries.............. ✓ PASS",
    pauseAfter: 160,
    type: "pass",
  },
  {
    prefix: "PASS",
    text: "Element overlap detection........... ✓ PASS",
    pauseAfter: 480,
    type: "pass",
  },
  {
    prefix: "DONE",
    text: "✦ System fully restored. All nodes operational.",
    pauseAfter: 0,
    type: "done",
  },
];

/** ms per character while typing */
const CHAR_SPEED = 28;

// ---------------------------------------------------------------------------
// Colour map — warm tones meeting QA colour conventions
// ---------------------------------------------------------------------------

const TYPE_COLOURS: Record<LogType, string> = {
  info: "text-[#5b7fa6]",
  warn: "text-amber-500 dark:text-amber-400",
  proc: "text-[#4a90c4]",
  fix:  "text-teal-500 dark:text-teal-400",
  test: "text-violet-500 dark:text-violet-400",
  pass: "text-emerald-500 dark:text-emerald-400",
  done: "text-emerald-400 dark:text-emerald-300 font-semibold",
};

const PREFIX_COLOURS: Record<LogType, string> = {
  info: "text-[#0b1957]/50 dark:text-white/40",
  warn: "text-amber-600/80 dark:text-amber-400/80",
  proc: "text-[#0b1957]/50 dark:text-white/40",
  fix:  "text-teal-600/80 dark:text-teal-400/80",
  test: "text-violet-600/80 dark:text-violet-400/80",
  pass: "text-emerald-600/80 dark:text-emerald-400/80",
  done: "text-emerald-500 dark:text-emerald-400",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** macOS-style window traffic lights */
function TrafficLights() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      <div className="w-3 h-3 rounded-full bg-red-400/80" />
      <div className="w-3 h-3 rounded-full bg-amber-400/80" />
      <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
    </div>
  );
}

/** A single rendered log line */
function LogLine({
  prefix,
  text,
  charCount,
  type,
  showCursor,
}: {
  prefix: string;
  text: string;
  charCount: number;
  type: LogType;
  showCursor: boolean;
}) {
  const rendered = text.slice(0, charCount);

  return (
    <div className="flex items-start gap-2 font-mono text-xs sm:text-[13px] leading-relaxed">
      {/* prompt */}
      <span className="text-[#0b1957]/30 dark:text-white/25 shrink-0 select-none">›</span>

      {/* prefix badge */}
      <span
        className={`shrink-0 text-[10px] font-bold tracking-widest opacity-80 pt-px ${PREFIX_COLOURS[type]}`}
      >
        [{prefix}]
      </span>

      {/* typed content */}
      <span className={TYPE_COLOURS[type]}>
        {rendered}
        {showCursor && (
          <motion.span
            className="inline-block w-[2px] h-[1em] bg-current align-middle ml-0.5 rounded-full"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          />
        )}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface RenderedLine extends ScriptEntry {
  charCount: number;
}

export function RescueTerminal() {
  const completeHeal = useCompleteHeal();
  const [lines, setLines] = useState<RenderedLine[]>([]);
  const [scriptDone, setScriptDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const cancelledRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Auto-scroll to bottom as new lines appear ──────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // ── Typewriter engine ──────────────────────────────────────────────────
  useEffect(() => {
    cancelledRef.current = false;

    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (cancelledRef.current) reject(new Error("cancelled"));
          else resolve();
        }, ms);
      });

    const run = async () => {
      try {
        for (let i = 0; i < SCRIPT.length; i++) {
          if (cancelledRef.current) break;
          const entry = SCRIPT[i];

          // ① Add line stub with 0 characters
          setLines((prev) => [...prev, { ...entry, charCount: 0 }]);

          // ② Type characters one by one
          for (let c = 1; c <= entry.text.length; c++) {
            await wait(CHAR_SPEED);
            setLines((prev) => {
              const next = [...prev];
              next[i] = { ...next[i], charCount: c };
              return next;
            });
          }

          // ③ Update progress bar
          setProgress(Math.round(((i + 1) / SCRIPT.length) * 100));

          // ④ Pause before next line
          if (entry.pauseAfter > 0) await wait(entry.pauseAfter);
        }

        // All lines done — show success, then trigger heal completion
        setScriptDone(true);
        await wait(1400);
        completeHeal();
      } catch {
        // Silently swallow "cancelled" rejections from wait()
        // Any other error would also be caught here but that is acceptable
      }
    };

    run();

    return () => {
      cancelledRef.current = true;
    };
  }, [completeHeal]); // eslint-disable-line react-hooks/exhaustive-deps

  // ChaosHud mounts/unmounts this component via its own AnimatePresence.
  // We just render the motion.div directly — no double-wrapping needed.
  return (
    <motion.div
      id="rescue-terminal"
      role="log"
      aria-label="QA Auto-Healing Terminal"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[10005] w-[calc(100vw-2rem)] max-w-2xl"
      style={{ translateX: "-50%" }}
      initial={{ y: 60, opacity: 0, scale: 0.97 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 60, opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
          {/* ── Glass window ─────────────────────────────────────────── */}
          <div
            className="rounded-2xl border border-[#d4c4b0]/60 dark:border-white/10 overflow-hidden shadow-2xl shadow-[#0b1957]/15"
            style={{
              background:
                "linear-gradient(135deg, rgba(248,243,234,0.88) 0%, rgba(255,255,255,0.82) 100%)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
            }}
          >
            {/* ── Title bar ──────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#d4c4b0]/50 dark:border-white/10 bg-[#f0e9de]/60 dark:bg-white/5">
              <TrafficLights />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Terminal className="w-3.5 h-3.5 text-[#0b1957]/50 dark:text-white/40 shrink-0" />
                <span className="font-mono text-[11px] font-semibold text-[#0b1957]/60 dark:text-white/50 tracking-wider truncate">
                  QA Auto-Heal Terminal — v2.3.1
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Minus className="w-3 h-3 text-[#0b1957]/30" />
                <X className="w-3 h-3 text-[#0b1957]/30" />
              </div>
            </div>

            {/* ── Terminal body ───────────────────────────────────────── */}
            <div
              ref={scrollRef}
              className="h-52 sm:h-60 overflow-y-auto p-4 space-y-1.5 scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {/* Prompt header */}
              <div className="font-mono text-[11px] text-[#0b1957]/30 dark:text-white/20 mb-3 pb-2 border-b border-[#d4c4b0]/40 dark:border-white/10">
                isna@qa-sandbox:~$ ./run-healing-pipeline.sh --target=hero --force
              </div>

              {lines.map((line, idx) => (
                <LogLine
                  key={idx}
                  prefix={line.prefix}
                  text={line.text}
                  charCount={line.charCount}
                  type={line.type}
                  showCursor={
                    idx === lines.length - 1 &&
                    line.charCount < line.text.length
                  }
                />
              ))}

              {/* Success state */}
              <AnimatePresence>
                {scriptDone && (
                  <motion.div
                    className="flex items-center gap-2 mt-3 pt-3 border-t border-emerald-400/30"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      Pipeline complete — restoring layout...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Progress bar ────────────────────────────────────────── */}
            <div className="px-4 pb-3 pt-2 border-t border-[#d4c4b0]/40 dark:border-white/10 bg-[#f0e9de]/40 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] text-[#0b1957]/40 dark:text-white/30 tracking-wider">
                  HEALING PROGRESS
                </span>
                <span className="font-mono text-[10px] font-bold text-[#0b1957]/60 dark:text-white/50 tabular-nums">
                  {progress}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#d4c4b0]/50 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>

              {/* Status dots */}
              <div className="flex items-center gap-1.5 mt-2">
                {SCRIPT.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`rounded-full ${
                      i < lines.length
                        ? "bg-emerald-400 w-1.5 h-1.5"
                        : "bg-[#d4c4b0]/60 dark:bg-white/15 w-1 h-1"
                    }`}
                    animate={
                      i === lines.length - 1 && !scriptDone
                        ? { scale: [1, 1.4, 1] }
                        : {}
                    }
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </div>
    </motion.div>
  );
}
