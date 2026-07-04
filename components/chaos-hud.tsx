/**
 * ChaosHud.tsx
 *
 * Root-level HUD that renders contextual overlays based on the sandbox phase:
 *
 *   phase = "crashed"
 *     → Floating "ACTIVATE AUTO-HEALING PIPELINE" button at the bottom.
 *
 *   phase = "healing"
 *     → Blueprint grid background fades in.
 *     → RescueTerminal overlay is mounted and runs its log sequence.
 *
 *   phase = "verified"
 *     → Terminal exits with AnimatePresence.
 *     → Blueprint grid stays briefly, then fades.
 *     → "System Restored" banner + "Reset Sandbox" button appear.
 *     → PhysicsEngine is destroyed 2.5 s after verified (all return
 *       animations have long finished by then).
 *
 * Z-index hierarchy:
 *   Blueprint BG overlay ─ 9980
 *   Physics canvas (Matter.js) ─ 9998
 *   Physics DOM elements ─ 9999
 *   Return-animation elements ─ 10001
 *   Chaos HUD button ─ 10000
 *   RescueTerminal ─ 10005
 *   System-restored banner ─ 10006
 *   Crash toast ─ 10007
 *   Custom cursor ─ 10009-10010
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Activity, CheckCircle2, RefreshCw, AlertTriangle, X } from "lucide-react";
import { useSandboxPhase, useTriggerHeal, useResetSandbox } from "@/lib/sandbox-store";

import { RescueTerminal } from "@/components/rescue-terminal";
import {
  disablePhysicsPointer,
  destroyPhysicsEngine,
} from "@/lib/physics-engine";

// ---------------------------------------------------------------------------
// Blueprint background overlay
// ---------------------------------------------------------------------------

function BlueprintBackground() {
  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[9980]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.8, ease: "easeInOut" }}
    >
      {/* Main grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(11,25,87,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11,25,87,0.045) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Sub-grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(11,25,87,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11,25,87,0.022) 1px, transparent 1px)
          `,
          backgroundSize: "8px 8px",
        }}
      />
      {/* Corner dots */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="blueprint-dots"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="0" cy="0" r="1.2" fill="rgba(11,25,87,0.07)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-dots)" />
      </svg>
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(248,243,234,0.55) 100%)",
        }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Crash toast (Doodle style)
// ---------------------------------------------------------------------------

function CrashToast({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      id="crash-toast"
      role="alert"
      aria-live="assertive"
      className="fixed top-24 left-1/2 z-[10010] w-[calc(100vw-2rem)] max-w-lg"
      style={{ translateX: "-50%" }}
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -120, opacity: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      {/* Doodle red tape sticker above the note */}
      <div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-red-500/20 dark:bg-red-500/10 border border-red-500/30 z-20 pointer-events-none"
        style={{
          borderRadius: "1px",
          transform: "translateX(-50%) rotate(-2deg)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      />

      <div 
        className="relative flex items-start gap-3 bg-red-50/95 dark:bg-red-950/95 px-5 py-4 border-2 border-red-500 text-foreground"
        style={{
          borderRadius: "16px 4px 18px 5px / 5px 18px 4px 16px",
          boxShadow: "5px 5px 0 rgba(239, 68, 68, 0.4)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* icon */}
        <div className="mt-0.5 shrink-0 rounded-lg bg-red-500/10 p-1.5 border border-red-500/20">
          <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
        </div>

        {/* text */}
        <div className="flex-1 min-w-0 text-left">
          <p className="font-handwritten text-sm font-bold tracking-wider text-red-600 dark:text-red-400 uppercase">
            ⚠️ Critical Exception
          </p>
          <p className="mt-1 font-mono text-xs font-semibold text-red-950 dark:text-red-100">
            DOM Exceptions Detected. CSS Grid Collapsed.
          </p>
          <p className="mt-1.5 font-mono text-[10px] text-red-800/60 dark:text-red-300/60">
            at HeroSection.render() — stress_test.spec.ts:42
          </p>
        </div>

        {/* dismiss */}
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 text-red-500/50 hover:bg-red-50/20 hover:text-red-600 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar — drains over 6 s */}
      <motion.div
        className="mt-2 h-1 rounded-full bg-red-500/50 max-w-[96%] mx-auto"
        initial={{ scaleX: 1, originX: 0 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 6, ease: "linear" }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Activate button
// ---------------------------------------------------------------------------


function ActivateButton({ onActivate }: { onActivate: () => void }) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = useCallback(() => {
    if (isPressed) return;
    setIsPressed(true);
    onActivate();
  }, [isPressed, onActivate]);

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 z-[10000]"
      style={{ translateX: "-50%" }}
      initial={{ y: 100, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 100, opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 340, damping: 28, delay: 0.5 }}
    >
      <motion.button
        id="activate-healing-btn"
        onClick={handleClick}
        disabled={isPressed}
        className={[
          "btn-sticker-apply flex items-center gap-3 px-6 py-3.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
          isPressed
            ? "cursor-not-allowed border-emerald-800/30 bg-emerald-100/10 text-emerald-500/30 opacity-40 shadow-none transform-none"
            : "border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-100/30",
        ].join(" ")}
        style={{
          boxShadow: isPressed ? "none" : "3px 3px 0 rgba(16, 185, 129, 0.4)",
          borderRadius: "255px 12px 255px 12px / 12px 255px 12px 255px",
        }}
        whileHover={isPressed ? {} : { scale: 1.02 }}
        whileTap={isPressed ? {} : { scale: 0.97 }}
        aria-label="Activate QA Auto-Healing Pipeline"
      >
        <motion.span
          animate={isPressed ? {} : { rotate: [0, 12, -12, 0] }}
          transition={{
            duration: 0.5,
            delay: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          className="shrink-0"
        >
          {isPressed ? (
            <Activity className="w-4.5 h-4.5 text-emerald-500/50" />
          ) : (
            <Zap className="w-4.5 h-4.5 text-emerald-500" />
          )}
        </motion.span>

        <span className="font-handwritten font-bold tracking-wide">
          {isPressed ? "Initialising Pipeline..." : "Activate Auto-Healing Pipeline"}
        </span>

        {!isPressed && (
          <motion.span
            className="inline-block w-[2px] h-[1em] bg-emerald-400 align-middle rounded-full ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
            aria-hidden
          />
        )}
      </motion.button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// System Restored banner + Reset button
// ---------------------------------------------------------------------------

function SystemRestoredBanner({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      id="system-restored-banner"
      className="fixed bottom-6 left-1/2 z-[10006] w-[calc(100vw-2rem)] max-w-md"
      style={{ translateX: "-50%" }}
      initial={{ y: 60, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 60, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 360, damping: 30, delay: 0.4 }}
    >
      {/* Doodle green tape sticker above the restored banner */}
      <div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-emerald-500/20 dark:bg-emerald-500/10 border border-emerald-500/30 z-20 pointer-events-none"
        style={{
          borderRadius: "1px",
          transform: "translateX(-50%) rotate(1deg)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      />

      <div
        className="flex items-center gap-4 px-5 py-3.5 bg-emerald-50/95 dark:bg-emerald-950/95 border-2 border-emerald-500"
        style={{
          borderRadius: "16px 4px 18px 5px / 5px 18px 4px 16px",
          boxShadow: "4px 4px 0 rgba(16, 185, 129, 0.4)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Pulsing check icon */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="shrink-0"
        >
          <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 dark:text-emerald-400" />
        </motion.div>

        <div className="flex-1 min-w-0 text-left">
          <p className="font-handwritten text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
            ✓ System Restored
          </p>
          <p className="font-mono text-[10px] text-emerald-800/70 dark:text-emerald-400/70 mt-0.5">
            All DOM nodes verified | layout: 100%
          </p>
        </div>

        {/* Reset button as mini-doodle sticker */}
        <motion.button
          onClick={onReset}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 font-handwritten text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 border border-emerald-500/50 bg-emerald-100/10 hover:bg-emerald-100/30 transition-all duration-200"
          style={{
            borderRadius: "120px 8px 120px 8px / 8px 120px 8px 120px",
            boxShadow: "2px 2px 0 rgba(16, 185, 129, 0.25)",
          }}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Reset sandbox to idle state"
        >
          <RefreshCw className="w-3 h-3" />
          Reset
        </motion.button>
      </div>
    </motion.div>
  );
}


// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function ChaosHud() {
  const phase      = useSandboxPhase();
  const triggerHeal = useTriggerHeal();
  const reset       = useResetSandbox();

  const [showToast, setShowToast] = useState(false);

  // ── Terminal visibility: only during "healing" (exits on verified) ────────
  const showTerminal = phase === "healing";

  // ── Blueprint: show during healing + briefly during verified ─────────────
  const showBlueprint = phase === "healing" || phase === "verified";

  // ── Restore banner: only in verified ────────────────────────────────────
  const showRestored = phase === "verified";

  // Trigger crash toast when phase transitions to "crashed"
  useEffect(() => {
    if (phase === "crashed") {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [phase]);

  // ── Destroy physics engine 2.5 s after verified ──────────────────────────
  // (all return animations complete within ~1.8 s)
  useEffect(() => {
    if (phase !== "verified") return;
    const t = setTimeout(() => {
      destroyPhysicsEngine();
    }, 2500);
    return () => clearTimeout(t);
  }, [phase]);

  const handleActivate = useCallback(() => {
    disablePhysicsPointer();
    triggerHeal();
  }, [triggerHeal]);

  return (
    <>
      {/* ── Crash Toast Overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {showToast && (
          <CrashToast key="crash-toast" onDismiss={() => setShowToast(false)} />
        )}
      </AnimatePresence>

      {/* ── Blueprint grid background ─────────────────────────────── */}
      <AnimatePresence>
        {showBlueprint && <BlueprintBackground key="blueprint" />}
      </AnimatePresence>

      {/* ── Floating activate button ──────────────────────────────── */}
      <AnimatePresence>
        {phase === "crashed" && (
          <ActivateButton key="activate-btn" onActivate={handleActivate} />
        )}
      </AnimatePresence>

      {/* ── QA Rescue Terminal ────────────────────────────────────── */}
      <AnimatePresence>
        {showTerminal && <RescueTerminal key="rescue-terminal" />}
      </AnimatePresence>

      {/* ── System Restored banner ────────────────────────────────── */}
      <AnimatePresence>
        {showRestored && (
          <SystemRestoredBanner key="restored-banner" onReset={reset} />
        )}
      </AnimatePresence>
    </>
  );
}

