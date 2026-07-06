"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, Home, RefreshCw, Search } from "lucide-react";
import Link from "next/link";

const DoodleBug = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 80 80"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <ellipse cx="40" cy="46" rx="13" ry="16" strokeWidth="2.5" />
    <ellipse cx="40" cy="30" rx="9" ry="10" strokeWidth="2.5" />
    <line x1="27" y1="40" x2="13" y2="33" strokeWidth="2" />
    <line x1="27" y1="47" x2="11" y2="47" strokeWidth="2" />
    <line x1="27" y1="54" x2="13" y2="61" strokeWidth="2" />
    <line x1="53" y1="40" x2="67" y2="33" strokeWidth="2" />
    <line x1="53" y1="47" x2="69" y2="47" strokeWidth="2" />
    <line x1="53" y1="54" x2="67" y2="61" strokeWidth="2" />
    <circle cx="35" cy="27" r="1.5" fill="currentColor" strokeWidth="0" />
    <circle cx="45" cy="27" r="1.5" fill="currentColor" strokeWidth="0" />
  </svg>
);

export default function NotFound() {
  const [logLines, setLogLines] = useState<string[]>([]);
  const [tick, setTick] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const logs = [
      "> Initializing QA environment...",
      "> Running route resolution tests...",
      "> Test case #404: GET /unknown-page",
      "> Expected: 200 OK  |  Got: 404 NOT FOUND",
      "> ❌ FAIL — Route not found in sitemap",
      "> Logging defect to backlog...",
      "> Severity: CRITICAL  |  Priority: P1",
      "> Assigned to: Navigator 🧭",
      "> Status: OPEN — awaiting fix",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        const lineToAdd = logs[i];
        setLogLines((prev) => [...prev, lineToAdd]);
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 380);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 530);
    return () => clearInterval(t);
  }, []);

  const floatingBugs = [
    { x: "7%",  y: "10%", delay: 0,   size: "w-12 h-12", opacity: "opacity-20" },
    { x: "87%", y: "16%", delay: 1.5, size: "w-8 h-8",   opacity: "opacity-15" },
    { x: "4%",  y: "72%", delay: 0.8, size: "w-16 h-16", opacity: "opacity-10" },
    { x: "89%", y: "68%", delay: 2.2, size: "w-10 h-10", opacity: "opacity-20" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(171,136,109,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(171,136,109,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating doodle bugs */}
      {floatingBugs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute text-primary pointer-events-none select-none ${b.opacity}`}
          style={{ left: b.x, top: b.y }}
          animate={{ y: [0, -14, 0], rotate: [0, 8, -5, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        >
          <DoodleBug className={b.size} />
        </motion.div>
      ))}

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-strong sketchy-border overflow-hidden"
          style={{ borderRadius: "22px 6px 20px 6px / 6px 20px 6px 22px" }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-primary/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <div className="w-3 h-3 rounded-full bg-green-400/70" />
            </div>
            <span className="text-xs font-mono text-muted-foreground ml-2 flex items-center gap-1.5">
              <Bug className="w-3 h-3" />
              bug-report.log — QA Terminal
            </span>
          </div>

          {/* Body */}
          <div className="p-8 text-center">
            {/* 404 */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              className="relative mb-4 flex justify-center"
            >
              <motion.span
                className="text-[8rem] sm:text-[9.5rem] font-bold leading-none select-none"
                style={{
                  fontFamily: "var(--font-kalam)",
                  background: "linear-gradient(135deg, hsl(var(--primary)) 40%, hsl(var(--primary) / 0.3))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{ rotate: [0, -1, 1, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                404
              </motion.span>
            </motion.div>

            {/* Badge */}
            <div className="flex justify-center mb-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono border bg-red-500/10 border-red-500/30 text-red-500 dark:text-red-400"
                style={{ borderRadius: "8px 3px 8px 3px / 3px 8px 3px 8px" }}
              >
                <Bug className="w-3 h-3" />
                BUG-404 · CRITICAL · Status: OPEN
              </motion.div>
            </div>


            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-foreground mb-2 doodle-section-heading inline-block"
              style={{ fontFamily: "var(--font-kalam)" }}
            >
              Page Not Found
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-sm text-muted-foreground mb-8 leading-relaxed mt-4"
            >
              Our QA eye caught a broken route. This page doesn't exist —
              but at least we're writing a proper bug report about it.{" "}
              <motion.span
                animate={{ rotate: [0, 20, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="inline-block"
              >
                🐛
              </motion.span>
            </motion.p>

            {/* Terminal log */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="bg-background/60 border border-border/40 text-left mb-8 font-mono text-[11px] leading-6 overflow-hidden p-4"
              style={{ borderRadius: "12px 4px 12px 4px / 4px 12px 4px 12px", minHeight: "148px" }}
            >
              <AnimatePresence>
                {logLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22 }}
                    className={
                      line && (line.includes("FAIL") || line.includes("CRITICAL"))
                        ? "text-red-500 dark:text-red-400"
                        : line && (line.includes("OPEN") || line.includes("P1"))
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-muted-foreground"
                    }
                  >
                    {line || ""}
                  </motion.div>
                ))}
              </AnimatePresence>
              {!done && (
                <span className="text-primary">{tick % 2 === 0 ? "▋" : "\u00A0"}</span>
              )}
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 btn-sticker-apply btn-sticker-primary-apply"
                style={{ borderRadius: "14px 4px 14px 4px / 4px 14px 4px 14px" }}
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted/40 transition-all duration-150"
                style={{ borderRadius: "4px 14px 4px 14px / 14px 4px 14px 4px" }}
              >
                <RefreshCw className="w-4 h-4" />
                Go Back
              </button>
            </motion.div>
          </div>

          {/* Footer bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 bg-muted/20 text-[10px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Search className="w-3 h-3" />
              isna-portfolio · QA Mode
            </span>
            <span>HTTP 404 · Route: Not Found</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

