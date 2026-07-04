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
import { Zap, Activity, CheckCircle2, RefreshCw } from "lucide-react";
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
      {/* Pulsing ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-emerald-400/20"
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.button
        id="activate-healing-btn"
        onClick={handleClick}
        disabled={isPressed}
        className={[
          "relative group flex items-center gap-3 px-6 py-3.5 rounded-2xl",
          "font-mono text-sm font-bold tracking-widest uppercase",
          "border shadow-xl shadow-emerald-900/20",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
          "transition-all duration-300",
          isPressed
            ? "cursor-not-allowed border-emerald-700/30 bg-emerald-950/30 text-emerald-600/40"
            : [
                "cursor-pointer border-emerald-400/50 text-emerald-300",
                "hover:border-emerald-300/80 hover:shadow-2xl hover:shadow-emerald-500/25",
              ].join(" "),
        ].join(" ")}
        style={{
          background: isPressed
            ? "rgba(5,46,22,0.25)"
            : "linear-gradient(135deg, rgba(5,46,22,0.85) 0%, rgba(6,78,59,0.80) 100%)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
        }}
        whileHover={isPressed ? {} : { scale: 1.03, y: -2 }}
        whileTap={isPressed ? {} : { scale: 0.97 }}
        aria-label="Activate QA Auto-Healing Pipeline"
      >
        {/* Scanline sweep */}
        {!isPressed && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
            aria-hidden
          >
            <motion.div
              className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "300%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </motion.div>
        )}

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
            <Activity className="w-4 h-4 text-emerald-500/50" />
          ) : (
            <Zap className="w-4 h-4 text-emerald-300" />
          )}
        </motion.span>

        <span>
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
      <div
        className="flex items-center gap-4 px-5 py-3.5 rounded-2xl border"
        style={{
          background:
            "linear-gradient(135deg, rgba(5,46,22,0.88) 0%, rgba(6,78,59,0.82) 100%)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          border: "1px solid rgba(74,222,128,0.4)",
          boxShadow:
            "0 8px 32px rgba(74,222,128,0.15), 0 0 0 1px rgba(74,222,128,0.1)",
        }}
      >
        {/* Pulsing check icon */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="shrink-0"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs font-bold text-emerald-300 tracking-widest uppercase">
            System Fully Restored
          </p>
          <p className="font-mono text-[11px] text-emerald-500/70 mt-0.5">
            All DOM nodes verified ✓  |  layout integrity: 100%
          </p>
        </div>

        {/* Reset button */}
        <motion.button
          onClick={onReset}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                     font-mono text-[11px] font-semibold tracking-wider
                     text-emerald-300/70 border border-emerald-500/30
                     hover:text-emerald-200 hover:border-emerald-400/60
                     hover:bg-emerald-500/10 transition-all duration-200"
          whileHover={{ scale: 1.04 }}
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

  // ── Terminal visibility: only during "healing" (exits on verified) ────────
  const showTerminal = phase === "healing";

  // ── Blueprint: show during healing + briefly during verified ─────────────
  const showBlueprint = phase === "healing" || phase === "verified";

  // ── Restore banner: only in verified ────────────────────────────────────
  const showRestored = phase === "verified";

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
