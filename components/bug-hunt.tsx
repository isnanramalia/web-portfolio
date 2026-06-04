"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bug,
  CheckCircle2,
  AlertCircle,
  User,
  MousePointerClick,
  Trophy,
  X,
} from "lucide-react";

// ── Confetti ──────────────────────────────────────────────────────────────
const CONFETTI_COLORS = [
  "#dc2626",
  "#9eccfa",
  "#0b1957",
  "#fbbf24",
  "#10b981",
  "#f97316",
  "#a855f7",
];

interface Particle {
  id: number;
  x: number;
  y: number; // fixed origin (px)
  tx: number;
  ty: number; // translate target
  color: string;
  size: number;
  rot: number;
  round: boolean;
}

function makeParticles(cx: number, cy: number): Particle[] {
  return Array.from({ length: 14 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.5;
    const dist = 55 + Math.random() * 85;
    return {
      id: i,
      x: cx,
      y: cy,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist - 38, // slight upward bias
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 4 + Math.floor(Math.random() * 5),
      rot: Math.floor(Math.random() * 360),
      round: i % 3 === 0,
    };
  });
}

// ── Tuning ────────────────────────────────────────────────────────────────
const FIRST_SPAWN_MS = 30_000; // first bug: 30 s after page load
const REPEAT_MS = 3 * 60_000; // then every 3 min
const VISIBLE_MS = 15_000; // auto-hide if not caught
const CARD_MS = 6_000; // card auto-dismiss

// ── Content ───────────────────────────────────────────────────────────────
const BUG_TITLES = [
  "Unidentified creature detected in viewport",
  "Unauthorized entity accessing DOM layer",
  "Wild ladybug appeared in UI component tree",
  "Foreign critter found on page re-render",
  "Unexpected organism in production env",
  "Critical cuteness overflow — severity: cute",
  "Null pointer exception: bug not in spec",
  "Ladybug escaped from test environment",
];

const SEVERITIES = [
  {
    label: "LOW",
    bg: "bg-yellow-500/10",
    text: "text-yellow-600",
    border: "border-yellow-500/25",
  },
  {
    label: "MINOR",
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-500/25",
  },
  {
    label: "COSMETIC",
    bg: "bg-green-500/10",
    text: "text-green-600",
    border: "border-green-500/25",
  },
];

// ── SVG Ladybug ───────────────────────────────────────────────────────────
function LadybugIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Body */}
      <ellipse cx="40" cy="52" rx="28" ry="22" fill="#dc2626" />
      {/* Wing divider */}
      <path
        d="M40 30 L40 74"
        stroke="#7f1d1d"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Head */}
      <circle cx="40" cy="24" r="15" fill="#1c1917" />
      {/* Eyes */}
      <circle cx="33.5" cy="20" r="4" fill="white" />
      <circle cx="46.5" cy="20" r="4" fill="white" />
      <circle cx="34.5" cy="21" r="2" fill="#1c1917" />
      <circle cx="47.5" cy="21" r="2" fill="#1c1917" />
      {/* Antennae */}
      <path
        d="M33 11 Q28 4 24 2"
        stroke="#1c1917"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M47 11 Q52 4 56 2"
        stroke="#1c1917"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="24" cy="2" r="2" fill="#1c1917" />
      <circle cx="56" cy="2" r="2" fill="#1c1917" />
      {/* Spots */}
      <circle cx="30" cy="48" r="5.5" fill="#7f1d1d" />
      <circle cx="50" cy="48" r="5.5" fill="#7f1d1d" />
      <circle cx="29" cy="62" r="4.5" fill="#7f1d1d" />
      <circle cx="51" cy="62" r="4.5" fill="#7f1d1d" />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────
interface BugReport {
  key: number;
  id: string;
  title: string;
  sev: (typeof SEVERITIES)[number];
  score: number;
}

const CATCH_MESSAGES = [
  "You spotted it before it shipped! 🎯",
  "QA instincts — activated! 🔍",
  "Bug documented. Ship it! ✅",
  "That's a P3 severity catch! 🏆",
  "Regression caught in the wild! 🦺",
  "Test case: PASS. Bug: CLOSED. 🟢",
  "You'd make a great QA engineer! 🧪",
  "Found & Fixed. Classic QA flow! ⚡",
];

// ── Component ─────────────────────────────────────────────────────────────
export function BugHunt() {
  const [bugPos, setBugPos] = useState<{ x: number; y: number } | null>(null);
  const [report, setReport] = useState<BugReport | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);

  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreRef = useRef(0);
  const keyRef = useRef(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    const check = () => setIsDark(el.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const cancel = (
    r: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
  ) => {
    if (r.current) {
      clearTimeout(r.current);
      r.current = null;
    }
  };

  // ── Spawn ──────────────────────────────────────────────────────────────
  const spawn = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 640) return;

    const x = 6 + Math.random() * 74;
    const y = 14 + Math.random() * 62;

    setBugPos({ x, y });
    cancel(hideRef);
    hideRef.current = setTimeout(() => setBugPos(null), VISIBLE_MS);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(spawn, FIRST_SPAWN_MS);
    const t2 = setInterval(spawn, REPEAT_MS);
    return () => {
      clearTimeout(t1);
      clearInterval(t2);
      cancel(hideRef);
      cancel(cardRef);
    };
  }, [spawn]);

  // ── Catch ──────────────────────────────────────────────────────────────
  const handleCatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    cancel(hideRef);
    setBugPos(null);

    scoreRef.current += 1;
    keyRef.current += 1;
    const n = scoreRef.current;
    setScore(n);

    // Confetti burst at click position
    setParticles(makeParticles(e.clientX, e.clientY));
    setTimeout(() => setParticles([]), 1100);

    setReport({
      key: keyRef.current,
      id: `BUG-${String(n).padStart(3, "0")}`,
      title: BUG_TITLES[(n - 1) % BUG_TITLES.length],
      sev: SEVERITIES[(n - 1) % SEVERITIES.length],
      score: n,
    });

    cancel(cardRef);
    cardRef.current = setTimeout(() => setReport(null), CARD_MS);
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed pointer-events-none"
          style={{
            zIndex: 9500,
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.round ? "50%" : "2px",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: p.tx, y: p.ty, opacity: 0, scale: 0.15, rotate: p.rot }}
          transition={{ duration: 0.9, ease: [0.2, 0, 0.55, 1] }}
        />
      ))}

      <AnimatePresence>
        {bugPos && (
          <motion.button
            key="bug"
            className="fixed z-[150] select-none focus:outline-none group"
            style={{ left: `${bugPos.x}vw`, top: `${bugPos.y}vh` }}
            aria-label="Catch the bug!"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 24 }}
            whileTap={{ scale: 0.75 }}
            onClick={handleCatch}
          >
            {/* Pulse ring */}
            <motion.span
              className="absolute inset-0 rounded-full bg-red-400 pointer-events-none"
              animate={{ scale: [1, 1.9], opacity: [0.45, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />

            {/* Bug icon */}
            <motion.span
              className="relative block w-11 h-11"
              animate={{
                y: [0, -3, 0],
                rotate: [0, -6, 6, -3, 3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1.5,
              }}
            >
              <LadybugIcon className="w-full h-full drop-shadow-md" />
            </motion.span>

            {/* Tooltip */}
            <motion.span
              className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-handwritten font-bold text-primary bg-background border-2 border-primary/30 px-2.5 py-0.5 shadow-sm pointer-events-none"
              style={{
                borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
              }}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              catch me! 🐞
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Bug Report Card (doodle-style sticky note) ────────────── */}
      <AnimatePresence>
        {report && (
          <motion.div
            key={report.key}
            className="fixed bottom-8 z-[150] w-[320px] max-w-[calc(100vw-2rem)]"
            style={{ left: "50%", x: "-50%" }}
            initial={{ opacity: 0, y: 40, scale: 0.88, rotate: -1 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: -0.5 }}
            exit={{ opacity: 0, y: 28, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Sticky-note green card — colour-aware via state */}
            <div
              className="overflow-hidden relative"
              style={{
                background: isDark
                  ? "linear-gradient(to bottom, #0e3119, #0a2314 80%)"
                  : "linear-gradient(to bottom, #dcfce7, #f0fdf4 80%)",
                border: `2px solid ${isDark ? "#166534" : "#86efac"}`,
                borderRadius: "3px 3px 3px 3px",
                boxShadow: isDark
                  ? "3px 4px 0 rgba(0,0,0,0.3), 7px 9px 18px rgba(0,0,0,0.2)"
                  : "3px 4px 0 rgba(0,0,0,0.11), 7px 9px 18px rgba(0,0,0,0.07)",
                paddingTop: "14px",
              }}
            >
              {/* Tape strip */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                  width: 52,
                  height: 14,
                  background: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.55)",
                  borderRadius: "0 0 3px 3px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                  transform: "translateX(-50%) rotate(-1.5deg)",
                  zIndex: 2,
                }}
                aria-hidden="true"
              />

              {/* ── Celebration banner */}
              <div
                className="px-4 py-2.5 flex items-center gap-2.5"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
              >
                <span className="text-base" aria-hidden>
                  🎉
                </span>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-bold leading-tight ${isDark ? "text-green-200" : "text-green-900"}`}
                    style={{ fontFamily: "var(--font-kalam), cursive" }}
                  >
                    Bug caught!
                  </p>
                  <p
                    className={`text-[10px] leading-tight mt-0.5 truncate ${isDark ? "text-green-300/70" : "text-green-800/70"}`}
                  >
                    {CATCH_MESSAGES[(report.score - 1) % CATCH_MESSAGES.length]}
                  </p>
                </div>
              </div>

              {/* ── Header: bug ID + status + close */}
              <div
                className="flex items-center justify-between px-4 py-2"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
              >
                <div className="flex items-center gap-2">
                  <Bug
                    className={`w-3.5 h-3.5 ${isDark ? "text-green-400" : "text-green-700"}`}
                  />
                  <span
                    className={`text-xs font-mono font-bold tracking-widest ${isDark ? "text-green-300" : "text-green-800"}`}
                  >
                    {report.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* CLOSED stamp */}
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-bold ${isDark ? "text-green-400" : "text-green-700"}`}
                    style={{
                      fontFamily: "var(--font-kalam), cursive",
                      border: "2px solid #15803d",
                      borderRadius: "2px",
                      padding: "1px 5px",
                      transform: "rotate(-6deg)",
                      opacity: 0.7,
                      letterSpacing: "0.1em",
                    }}
                  >
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    CLOSED
                  </span>
                  <button
                    onClick={() => {
                      cancel(cardRef);
                      setReport(null);
                    }}
                    className={`p-1 transition-colors ${isDark ? "text-green-400/70 hover:text-green-200" : "text-green-700/60 hover:text-green-900"}`}
                    style={{ borderRadius: "4px 10px 4px 10px" }}
                    aria-label="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ── Body */}
              <div className="px-4 py-3 space-y-3">
                <p
                  className={`text-sm font-bold leading-snug ${isDark ? "text-green-200" : "text-green-900"}`}
                  style={{ fontFamily: "var(--font-kalam), cursive" }}
                >
                  {report.title}
                </p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {/* Severity */}
                  <div className="flex items-center gap-1.5">
                    <AlertCircle
                      className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-green-400/60" : "text-green-700/60"}`}
                    />
                    <span
                      className={`text-xs ${isDark ? "text-green-300/60" : "text-green-800/60"}`}
                    >
                      Severity
                    </span>
                  </div>
                  <div>
                    {/* Dashed case-badge style */}
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 ${report.sev.text}`}
                      style={{
                        border: "1.5px dashed currentColor",
                        borderRadius: "3px",
                        opacity: 0.75,
                      }}
                    >
                      {report.sev.label}
                    </span>
                  </div>

                  {/* Assignee */}
                  <div className="flex items-center gap-1.5">
                    <User
                      className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-green-400/60" : "text-green-700/60"}`}
                    />
                    <span
                      className={`text-xs ${isDark ? "text-green-300/60" : "text-green-800/60"}`}
                    >
                      Assignee
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold ${isDark ? "text-green-200" : "text-green-900"}`}
                    style={{ fontFamily: "var(--font-kalam), cursive" }}
                  >
                    Isna
                  </span>

                  {/* Reporter */}
                  <div className="flex items-center gap-1.5">
                    <MousePointerClick
                      className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-green-400/60" : "text-green-700/60"}`}
                    />
                    <span
                      className={`text-xs ${isDark ? "text-green-300/60" : "text-green-800/60"}`}
                    >
                      Reporter
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold ${isDark ? "text-green-200" : "text-green-900"}`}
                    style={{ fontFamily: "var(--font-kalam), cursive" }}
                  >
                    You 😎
                  </span>

                  {/* Score */}
                  <div className="flex items-center gap-1.5">
                    <Trophy
                      className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-green-400/60" : "text-green-700/60"}`}
                    />
                    <span
                      className={`text-xs ${isDark ? "text-green-300/60" : "text-green-800/60"}`}
                    >
                      Caught
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold ${isDark ? "text-green-400" : "text-green-700"}`}
                    style={{ fontFamily: "var(--font-kalam), cursive" }}
                  >
                    {report.score} {report.score === 1 ? "bug" : "bugs"} 🏆
                  </span>
                </div>
              </div>

              {/* ── Pencil-style countdown bar */}
              <div
                className="h-1.5 overflow-hidden"
                style={{
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: "0 0 2px 2px",
                }}
              >
                <motion.div
                  className="h-full bg-green-500"
                  style={{ borderRadius: "0 0 2px 2px" }}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: CARD_MS / 1000, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
