"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ChevronDown, Terminal, X, Bug } from "lucide-react";
import { createPortal } from "react-dom";
import { DefectFinder } from "./defect-finder";

// ── Types ─────────────────────────────────────────────────────────────────────

type Severity = "critical" | "high" | "medium" | "low";
type CaseStatus = "pending" | "running" | "pass" | "fail";
type RunState = "idle" | "running" | "complete";

interface BugDetail {
  id: string;
  severity: Severity;
  title: string;
  steps: string[];
  expected: string;
  actual: string;
  priority: string;
  environment: string;
}

interface TestCaseData {
  id: string;
  title: string;
  duration: number;
  bug?: BugDetail;
}

interface SuiteData {
  name: string;
  cases: TestCaseData[];
}

// ── Severity palette (terminal colours – always dark context) ─────────────────

const SEV: Record<Severity, { label: string; color: string; bg: string }> = {
  critical: { label: "CRITICAL", color: "#f85149", bg: "rgba(248,81,73,0.12)" },
  high: { label: "HIGH", color: "#ffa657", bg: "rgba(255,166,87,0.12)" },
  medium: { label: "MEDIUM", color: "#e3b341", bg: "rgba(227,179,65,0.12)" },
  low: { label: "LOW", color: "#79c0ff", bg: "rgba(121,192,255,0.12)" },
};

// ── Test data ─────────────────────────────────────────────────────────────────

const SUITES: SuiteData[] = [
  {
    name: "Login & Authentication",
    cases: [
      {
        id: "TC-001",
        title: "Login with valid standard_user credentials",
        duration: 142,
      },
      {
        id: "TC-002",
        title: "Login error message shown for locked_out_user",
        duration: 89,
      },
      {
        id: "TC-003",
        title: "Logout clears session and redirects to login",
        duration: 67,
      },
      {
        id: "TC-004",
        title: "Direct URL /inventory.html without auth redirects",
        duration: 203,
        bug: {
          id: "BUG-008",
          severity: "low",
          title: "Content Flash Before Auth Redirect",
          steps: [
            "Open browser without logging in",
            "Navigate directly to /inventory.html",
          ],
          expected: "Immediate redirect to login page with no content visible",
          actual:
            "Inventory page renders briefly before redirect — authenticated content flashes",
          priority: "P4",
          environment: "Chrome 120",
        },
      },
    ],
  },
  {
    name: "Product Catalog",
    cases: [
      {
        id: "TC-005",
        title: "Product list shows all 6 items for standard_user",
        duration: 156,
      },
      {
        id: "TC-006",
        title: "Product images match their item descriptions",
        duration: 312,
        bug: {
          id: "BUG-001",
          severity: "critical",
          title: "Wrong Product Images — ID Mapping Error",
          steps: [
            "Login with standard_user credentials",
            "Navigate to the product catalog page",
            "Observe product images for all 6 listed items",
          ],
          expected: "Each product displays its own correct image",
          actual:
            "Images are mismatched across all products due to a backend ID-mapping error",
          priority: "P1",
          environment: "Chrome 120 · Windows 11",
        },
      },
      {
        id: "TC-007",
        title: "Sort by Price (low to high) reorders product list",
        duration: 178,
        bug: {
          id: "BUG-004",
          severity: "high",
          title: "Product Sort Dropdown Has No Effect",
          steps: [
            "Login as problem_user",
            "Select 'Price (low to high)' from sort dropdown",
            "Observe product order",
          ],
          expected: "Products reorder by ascending price",
          actual: "Product order unchanged after sort selection",
          priority: "P2",
          environment: "Chrome 120 · macOS",
        },
      },
      {
        id: "TC-008",
        title: "Clicking a product name navigates to detail page",
        duration: 234,
        bug: {
          id: "BUG-005",
          severity: "high",
          title: "Product Name Links Non-Navigable",
          steps: [
            "Login as problem_user",
            "Click any product name link",
            "Observe navigation",
          ],
          expected: "Navigates to product detail page",
          actual:
            "Nothing happens — product name links are completely non-functional",
          priority: "P2",
          environment: "Chrome 120 · Windows 11",
        },
      },
    ],
  },
  {
    name: "Shopping Cart",
    cases: [
      {
        id: "TC-009",
        title: "Adding item to cart increments badge count",
        duration: 95,
      },
      {
        id: "TC-010",
        title: "Remove button removes item from cart",
        duration: 287,
        bug: {
          id: "BUG-003",
          severity: "high",
          title: "'Remove' Button Non-Functional in Cart",
          steps: [
            "Login as problem_user",
            "Add an item to cart",
            "Open cart page",
            "Click 'Remove' button on any item",
          ],
          expected: "Item is removed from cart immediately",
          actual: "Remove button does not respond — item remains in cart",
          priority: "P1",
          environment: "Chrome 120 · Firefox 121",
        },
      },
      {
        id: "TC-011",
        title: "Cart resets to zero after logout",
        duration: 145,
        bug: {
          id: "BUG-009",
          severity: "low",
          title: "Cart Badge Count Persists After Logout",
          steps: ["Add items to cart", "Log out", "Log back in as any user"],
          expected: "Cart badge shows 0 items for fresh session",
          actual: "Previous session's cart count briefly visible after login",
          priority: "P4",
          environment: "Chrome 120",
        },
      },
    ],
  },
  {
    name: "Checkout Flow",
    cases: [
      {
        id: "TC-012",
        title: "standard_user completes full checkout end-to-end",
        duration: 523,
      },
      {
        id: "TC-013",
        title: "problem_user completes full checkout end-to-end",
        duration: 445,
        bug: {
          id: "BUG-002",
          severity: "critical",
          title: "Checkout Flow Completely Blocked for problem_user",
          steps: [
            "Login as problem_user",
            "Add any item to cart → click Checkout",
            "Try to fill in Last Name field",
            "Click Continue",
          ],
          expected: "Form proceeds to order summary page",
          actual:
            "Last Name field is non-functional; Continue button stays disabled",
          priority: "P1",
          environment: "Chrome 120 · Firefox 121",
        },
      },
      {
        id: "TC-014",
        title: "Empty form shows per-field validation messages",
        duration: 198,
        bug: {
          id: "BUG-007",
          severity: "medium",
          title: "Incomplete Form Validation Feedback",
          steps: [
            "Proceed to checkout",
            "Leave all fields empty",
            "Click Continue",
          ],
          expected:
            "Each empty field shows its own validation error with field-level highlight",
          actual:
            "Only 'First Name is required' shown even when all fields are empty",
          priority: "P3",
          environment: "Chrome 120",
        },
      },
    ],
  },
];

// ── Animation scheduling ──────────────────────────────────────────────────────

interface ScheduleEntry {
  suiteIdx: number;
  caseIdx: number;
  phase: "start" | "finish";
  at: number; // ms offset from run start
}

function buildSchedule(): ScheduleEntry[] {
  const entries: ScheduleEntry[] = [];
  let t = 500; // initial gap after "Running…"

  SUITES.forEach((suite, si) => {
    t += 250; // pause before each suite header
    suite.cases.forEach((tc, ci) => {
      entries.push({ suiteIdx: si, caseIdx: ci, phase: "start", at: t });
      t += Math.min(tc.duration, 380);
      entries.push({ suiteIdx: si, caseIdx: ci, phase: "finish", at: t });
      t += 160;
    });
    t += 180;
  });

  return entries;
}

const SCHEDULE = buildSchedule();
const TOTAL_AT = SCHEDULE[SCHEDULE.length - 1].at + 400;

// ── State helpers ─────────────────────────────────────────────────────────────

interface TerminalState {
  suiteVisible: boolean[];
  caseStatus: CaseStatus[][];
}

function makeInitState(): TerminalState {
  return {
    suiteVisible: SUITES.map(() => false),
    caseStatus: SUITES.map((s) => s.cases.map(() => "pending" as CaseStatus)),
  };
}

// ── Summary stats ─────────────────────────────────────────────────────────────

function countResults(state: TerminalState) {
  let passed = 0;
  let failed = 0;
  state.caseStatus.forEach((suite) =>
    suite.forEach((s) => {
      if (s === "pass") passed++;
      if (s === "fail") failed++;
    }),
  );
  return { passed, failed };
}

// ── BugPanel (expandable below terminal) ─────────────────────────────────────

function BugPanel({ bug, onClose }: { bug: BugDetail; onClose: () => void }) {
  const sev = SEV[bug.severity];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: 6, height: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ overflow: "hidden" }}
    >
      <div
        className="mt-3 p-5 border bg-card"
        style={{
          borderColor: sev.color + "40",
          borderRadius: "16px 4px 16px 4px / 4px 16px 4px 16px",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[11px] font-bold px-2 py-0.5 font-mono"
                style={{
                  color: sev.color,
                  background: sev.bg,
                  borderRadius: "3px 6px 3px 6px",
                  border: `1px solid ${sev.color}30`,
                }}
              >
                {bug.id}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5"
                style={{
                  color: sev.color,
                  background: sev.bg,
                  borderRadius: "3px 6px 3px 6px",
                }}
              >
                {sev.label}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {bug.priority}
              </span>
            </div>
            <h4 className="text-sm font-bold text-foreground font-handwritten">
              {bug.title}
            </h4>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors text-lg leading-none"
            aria-label="Close bug report"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Steps */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 font-handwritten">
              Steps to Reproduce
            </p>
            <ol className="space-y-1.5">
              {bug.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground/80">
                  <span className="text-xs font-mono text-muted-foreground shrink-0 mt-0.5 w-4 text-right">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide mb-1 font-handwritten">
                ✓ Expected
              </p>
              <p className="text-sm text-muted-foreground">{bug.expected}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-1 font-handwritten">
                ✗ Actual
              </p>
              <p className="text-sm text-muted-foreground">{bug.actual}</p>
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-wrap gap-x-4 gap-y-1 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Priority:</span>{" "}
              {bug.priority}
            </span>
            <span className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Env:</span>{" "}
              {bug.environment}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface QAPlaygroundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "terminal" | "game" | null;
  children: React.ReactNode;
}

function QAPlaygroundModal({ open, onOpenChange, type, children }: QAPlaygroundModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted, open]);

  if (!mounted || !open || !type) return null;

  const title = type === "terminal" ? "Automated Test Simulator" : "Defect Finder Game";

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="playground-backdrop"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenChange(false)}
          />

          {/* Wrapper */}
          <motion.div
            key="playground-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-3xl glass-strong sketchy-border shadow-2xl p-6 md:p-8 flex flex-col z-[10000] overflow-hidden text-left"
            style={{
              borderRadius: "24px 8px 24px 8px / 8px 24px 8px 24px",
              maxHeight: "92vh",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 rounded-full border border-border/40 hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors z-30"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title & Icon Header */}
            <div className="flex items-center gap-3 border-b border-border/30 pb-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                {type === "terminal" ? <Terminal className="w-5 h-5" /> : <Bug className="w-5 h-5 animate-pulse" />}
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono text-foreground leading-tight">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {type === "terminal" ? "E2E Test Execution log" : "Find 3 hidden defects on the form"}
                </p>
              </div>
            </div>

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto pr-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

// ── Main Component ────────────────────────────────────────────────────────────

export function QAPlaygroundSection() {
  const [ts, setTs] = useState<TerminalState>(makeInitState);
  const [runState, setRunState] = useState<RunState>("idle");
  const [activeBug, setActiveBug] = useState<BugDetail | null>(null);
  const [activeModal, setActiveModal] = useState<"terminal" | "game" | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  });

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const runTests = useCallback(() => {
    clearTimers();
    setTs(makeInitState());
    setActiveBug(null);
    setRunState("running");

    // Suite headers: reveal just before first case in suite
    SUITES.forEach((suite, si) => {
      const firstInSuite = SCHEDULE.find(
        (e) => e.suiteIdx === si && e.phase === "start",
      );
      if (!firstInSuite) return;
      const t = setTimeout(() => {
        setTs((prev) => ({
          ...prev,
          suiteVisible: prev.suiteVisible.map((v, i) => (i === si ? true : v)),
        }));
      }, firstInSuite.at - 200);
      timers.current.push(t);
    });

    // Case phase transitions
    SCHEDULE.forEach((entry) => {
      const t = setTimeout(() => {
        if (entry.phase === "start") {
          setTs((prev) => ({
            ...prev,
            caseStatus: prev.caseStatus.map((suite, si) =>
              si === entry.suiteIdx
                ? suite.map((s, ci) => (ci === entry.caseIdx ? "running" : s))
                : suite,
            ),
          }));
        } else {
          const hasBug = !!SUITES[entry.suiteIdx].cases[entry.caseIdx].bug;
          const next: CaseStatus = hasBug ? "fail" : "pass";
          setTs((prev) => ({
            ...prev,
            caseStatus: prev.caseStatus.map((suite, si) =>
              si === entry.suiteIdx
                ? suite.map((s, ci) => (ci === entry.caseIdx ? next : s))
                : suite,
            ),
          }));
        }
      }, entry.at);
      timers.current.push(t);
    });

    // Mark complete
    const done = setTimeout(() => setRunState("complete"), TOTAL_AT);
    timers.current.push(done);
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const { passed, failed } = countResults(ts);
  const totalCases = SUITES.reduce((n, s) => n + s.cases.length, 0);

  return (
    <motion.section
      id="qa"
      className="px-4 sm:px-6 lg:px-12 py-8 lg:py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.span
          className="section-eyebrow"
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
        >
          🔍 QA in Action
        </motion.span>

        <motion.h2
          className="text-2xl font-medium mt-2 text-foreground doodle-section-heading"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          QA Playground
        </motion.h2>

        <motion.p
          className="text-sm text-muted-foreground mt-3 max-w-lg"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          viewport={{ once: true }}
        >
          Explore different QA workflows. Run automated test suites using the simulator, or test your manual bug-hunting skills in our interactive game.
        </motion.p>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Card 1: Automated Test Simulator */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="glass-card sketchy-border p-6 cursor-pointer hover:border-primary/50 flex flex-col justify-between group min-h-[220px] text-left"
            onClick={() => {
              setActiveModal("terminal");
              if (runState === "idle") {
                setTimeout(runTests, 300);
              }
            }}
            style={{ borderRadius: "20px 6px 20px 6px / 6px 20px 6px 20px" }}
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground font-mono">
                Automated Test Simulator
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                Watch a real-time E2E test suite execute on a checkout application. Click failed assertions to view generated bug reports.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between text-xs font-mono font-bold text-primary">
              <span>Launch Simulator</span>
              <span>→</span>
            </div>
          </motion.div>

          {/* Card 2: Defect Finder Game */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="glass-card sketchy-border p-6 cursor-pointer hover:border-primary/50 flex flex-col justify-between group min-h-[220px] text-left"
            onClick={() => setActiveModal("game")}
            style={{ borderRadius: "6px 20px 6px 20px / 20px 6px 20px 6px" }}
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Bug className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-foreground font-mono">
                Defect Finder Game
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                Put on your QA hat! Inspect and interact with a checkout form to find and document 3 hidden functional/validation defects.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between text-xs font-mono font-bold text-primary">
              <span>Play Mini-Game</span>
              <span>→</span>
            </div>
          </motion.div>
        </div>

        {/* Dialog Popup */}
        <QAPlaygroundModal
          open={activeModal !== null}
          onOpenChange={(open) => {
            if (!open) {
              setActiveModal(null);
              if (activeModal === "terminal" && runState === "running") {
                clearTimers();
                setRunState("idle");
                setTs(makeInitState());
              }
            }
          }}
          type={activeModal}
        >
          {activeModal === "terminal" && (
            <div className="space-y-6">
              {/* Terminal window */}
              <div
                className="overflow-hidden shadow-2xl text-left"
                style={{
                  borderRadius: "16px 4px 16px 4px / 4px 16px 4px 16px",
                  border: "1px solid #30363d",
                }}
              >
                {/* Title bar */}
                <div
                  className="flex items-center gap-1.5 px-4 py-3"
                  style={{
                    background: "#161b22",
                    borderBottom: "1px solid #30363d",
                  }}
                >
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <div className="flex-1 flex items-center justify-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#7d8590]" />
                    <span className="text-[11px] text-[#7d8590] font-mono">
                      test-runner — saucedemo
                    </span>
                  </div>
                  {/* Run / Reset button in titlebar */}
                  <button
                    onClick={runTests}
                    disabled={runState === "running"}
                    className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-bold transition-opacity disabled:opacity-40"
                    style={{
                      background: runState === "complete" ? "#21262d" : "#1f6feb",
                      color: runState === "complete" ? "#7d8590" : "#ffffff",
                      borderRadius: "4px 8px 4px 8px",
                      border: "1px solid",
                      borderColor: runState === "complete" ? "#30363d" : "#388bfd55",
                    }}
                    aria-label={
                      runState === "complete"
                        ? "Run tests again"
                        : runState === "running"
                          ? "Running…"
                          : "Run tests"
                    }
                  >
                    {runState === "running" ? (
                      <>
                        <span className="animate-spin inline-block">⠋</span>
                        Running…
                      </>
                    ) : runState === "complete" ? (
                      <>
                        <RotateCcw className="w-3 h-3" />
                        Re-run
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        Run
                      </>
                    )}
                  </button>
                </div>

                {/* Output area */}
                <div
                  ref={outputRef}
                  className="p-4 font-mono text-[13px] leading-relaxed overflow-y-auto"
                  style={{
                    background: "#0d1117",
                    color: "#e6edf3",
                    minHeight: "240px",
                    maxHeight: "420px",
                  }}
                >
                  {/* Prompt */}
                  <div>
                    <span style={{ color: "#3fb950" }}>$</span>{" "}
                    <span style={{ color: "#e6edf3" }}>
                      npm run test:e2e -- --project=saucedemo
                    </span>
                  </div>

                  {runState === "idle" && (
                    <div
                      className="mt-2 flex items-center gap-2"
                      style={{ color: "#7d8590" }}
                    >
                      Press{" "}
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5"
                        style={{
                          background: "#21262d",
                          borderRadius: "3px 6px 3px 6px",
                          border: "1px solid #30363d",
                          color: "#e6edf3",
                        }}
                      >
                        <Play className="w-3 h-3" />
                        Run
                      </span>{" "}
                      to execute the test suite
                    </div>
                  )}

                  {(runState === "running" || runState === "complete") && (
                    <div className="mt-1" style={{ color: "#7d8590" }}>
                      {runState === "running" ? "▶  Running E2E automation test suite…" : ""}
                    </div>
                  )}

                  {/* Suite + case output */}
                  {ts.suiteVisible.some(Boolean) && (
                    <div className="mt-3 space-y-3">
                      {SUITES.map((suite, si) => {
                        if (!ts.suiteVisible[si]) return null;
                        return (
                          <div key={si}>
                            {/* Suite header */}
                            <div className="flex items-center gap-2 mb-1">
                              <span style={{ color: "#388bfd" }}>●</span>
                              <span
                                style={{ color: "#e6edf3" }}
                                className="font-bold"
                              >
                                {suite.name}
                              </span>
                            </div>

                            {/* Cases */}
                            <div className="space-y-0.5 ml-4">
                              {suite.cases.map((tc, ci) => {
                                const status = ts.caseStatus[si][ci];
                                if (status === "pending") return null;

                                const isBugActive = activeBug?.id === tc.bug?.id;

                                return (
                                  <div key={ci}>
                                    {/* Case row */}
                                    <div className="flex items-start gap-2">
                                      {status === "running" && (
                                        <>
                                          <span
                                            className="animate-spin inline-block shrink-0 mt-0.5"
                                            style={{ color: "#e3b341" }}
                                          >
                                            ⠋
                                          </span>
                                          <span style={{ color: "#e3b341" }}>
                                            {tc.title}
                                          </span>
                                        </>
                                      )}
                                      {status === "pass" && (
                                        <>
                                          <span
                                            className="shrink-0 mt-0.5"
                                            style={{ color: "#3fb950" }}
                                          >
                                            ✓
                                          </span>
                                          <span style={{ color: "#3fb950" }}>
                                            {tc.title}
                                          </span>
                                          <span
                                            className="shrink-0 tabular-nums"
                                            style={{ color: "#7d8590" }}
                                          >
                                            {tc.duration}ms
                                          </span>
                                        </>
                                      )}
                                      {status === "fail" && (
                                        <>
                                          <span
                                            className="shrink-0 mt-0.5"
                                            style={{ color: "#f85149" }}
                                          >
                                            ✗
                                          </span>
                                          <span style={{ color: "#f85149" }}>
                                            {tc.title}
                                          </span>
                                          <span
                                            className="shrink-0 tabular-nums"
                                            style={{ color: "#7d8590" }}
                                          >
                                            {tc.duration}ms
                                          </span>
                                        </>
                                      )}
                                    </div>

                                    {/* Bug ref — clickable */}
                                    {status === "fail" && tc.bug && (
                                      <button
                                        className="ml-4 mt-0.5 flex items-center gap-1.5 text-left w-full group"
                                        onClick={() =>
                                          setActiveBug(isBugActive ? null : tc.bug!)
                                        }
                                      >
                                        <span style={{ color: "#7d8590" }}>└─</span>
                                        <span
                                          className="text-[11px] font-bold"
                                          style={{
                                            color: SEV[tc.bug.severity].color,
                                          }}
                                        >
                                          {tc.bug.id}
                                        </span>
                                        <span
                                          className="text-[11px] font-bold uppercase"
                                          style={{
                                            color: SEV[tc.bug.severity].color,
                                            opacity: 0.75,
                                          }}
                                        >
                                          [{SEV[tc.bug.severity].label}]
                                        </span>
                                        <span
                                          className="text-[11px] flex-1 truncate group-hover:underline underline-offset-2"
                                          style={{ color: "#8b949e" }}
                                        >
                                          {tc.bug.title}
                                        </span>
                                        <ChevronDown
                                          className="w-3 h-3 shrink-0 transition-transform"
                                          style={{
                                            color: "#7d8590",
                                            transform: isBugActive
                                              ? "rotate(180deg)"
                                              : "none",
                                          }}
                                        />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Summary row */}
                  {runState === "complete" && (
                    <div
                      className="mt-4 pt-3 flex flex-wrap gap-x-4 gap-y-1"
                      style={{ borderTop: "1px solid #30363d" }}
                    >
                      <span style={{ color: "#3fb950" }}>✓ {passed} passed</span>
                      <span style={{ color: "#f85149" }}>✗ {failed} failed</span>
                      <span style={{ color: "#7d8590" }}>• {totalCases} total</span>
                      <span style={{ color: "#7d8590" }}>
                        •{" "}
                        {passed === totalCases
                          ? "All green!"
                          : `${totalCases - passed} need attention`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bug detail panel (inside modal, below) */}
              <AnimatePresence>
                {activeBug && (
                  <BugPanel
                    key={activeBug.id}
                    bug={activeBug}
                    onClose={() => setActiveBug(null)}
                  />
                )}
              </AnimatePresence>

              {/* Hint text */}
              {runState === "idle" && (
                <p className="text-xs text-muted-foreground font-handwritten italic text-center">
                  — 14 test cases across 4 suites, 9 bugs found —
                </p>
              )}
              {runState === "complete" && (
                <p className="text-xs text-muted-foreground font-handwritten italic text-center">
                  — click any failed test to read the full bug report —
                </p>
              )}
            </div>
          )}

          {activeModal === "game" && <DefectFinder />}
        </QAPlaygroundModal>
      </div>
    </motion.section>
  );
}
