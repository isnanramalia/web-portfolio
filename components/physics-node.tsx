"use client";

/**
 * PhysicsNode — v3 (single-effect, phase-only deps)
 *
 * Root cause of infinite update loop in v1/v2:
 *   - Multiple useEffects sharing overlapping deps (isActive + phase + functions)
 *   - useCallback functions in dep arrays creating subtle re-run cascades
 *   - stopPhysics/syncPositionLoop being deps while also having side effects
 *
 * v3 fix: ONE effect, ONE dep ([phase]), ALL props captured in refs.
 * No useCallback needed, no function refs in deps.
 */

import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import type { AnimationPlaybackControls } from "framer-motion";
import Matter from "matter-js";
import { useSandboxPhase } from "@/lib/sandbox-store";
import {
  addBody,
  removeBody,
  getPhysicsEngine,
  enablePhysicsPointer,
} from "@/lib/physics-engine";

// ---------------------------------------------------------------------------
// VerifiedBadge
// ---------------------------------------------------------------------------

function VerifiedBadge() {
  return (
    <motion.div
      aria-label="QA Verified 100%"
      className="absolute pointer-events-none select-none"
      style={{ top: -10, right: -10, zIndex: 2, transformOrigin: "center" }}
      initial={{ scale: 0, rotate: -20, opacity: 0 }}
      animate={{ scale: 1, rotate: -12, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.1 }}
    >
      <div
        className="px-2 py-0.5 font-mono text-[9px] font-black tracking-widest uppercase whitespace-nowrap"
        style={{
          border:         "1.5px solid rgba(74,222,128,0.85)",
          borderRadius:   3,
          color:          "rgba(74,222,128,0.95)",
          background:     "rgba(5,46,22,0.82)",
          backdropFilter: "blur(4px)",
          boxShadow:      "0 0 8px rgba(74,222,128,0.5)",
        }}
      >
        ✓ QA Verified 100%
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseTranslate(t: string): { x: number; y: number } | null {
  const m = t.match(/translate\(\s*(-?[\d.]+)px,\s*(-?[\d.]+)px\s*\)/);
  if (!m) return null;
  const x = parseFloat(m[1]), y = parseFloat(m[2]);
  return (isNaN(x) || isNaN(y)) ? null : { x, y };
}

function parseRotate(t: string): number {
  const m = t.match(/rotate\(\s*(-?[\d.e+-]+)rad\s*\)/);
  if (!m) return 0;
  const v = parseFloat(m[1]);
  return isNaN(v) ? 0 : v;
}

/** Undo only the styles PhysicsNode explicitly set — never cssText="" */
function restoreCSSFlow(el: HTMLElement) {
  el.style.position      = "";
  el.style.left          = "";
  el.style.top           = "";
  el.style.width         = "";
  el.style.height        = "";
  el.style.margin        = "";
  el.style.transform     = "";
  el.style.pointerEvents = "";
  el.style.zIndex        = "";
  el.style.willChange    = "";
  el.style.outline       = "";
  el.style.filter        = "";
  // transition + boxShadow are left so the residual glow can fade out.
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PhysicsNodeProps {
  children:        ReactNode;
  className?:      string;
  style?:          CSSProperties;
  restitution?:    number;
  friction?:       number;
  frictionAir?:    number;
  density?:        number;
  dropDelay?:      number;
  initialImpulse?: number;
  returnDelay?:    number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PhysicsNode({
  children,
  className,
  style,
  restitution    = 0.4,
  friction       = 0.1,
  frictionAir    = 0.012,
  density        = 0.002,
  dropDelay      = 0,
  initialImpulse = 1,
  returnDelay    = 0,
}: PhysicsNodeProps) {

  // ── DOM + physics refs ────────────────────────────────────────────────────
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const bodyRef       = useRef<Matter.Body | null>(null);
  const rafRef        = useRef<number | null>(null);
  const returnAnim    = useRef<AnimationPlaybackControls | null>(null);
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dimRef        = useRef({ w: 0, h: 0 });
  const originRef     = useRef<{ left: number; top: number } | null>(null);
  const returningRef  = useRef(false);

  // ── Prop refs — keep latest value inside effects without adding to deps ───
  const rRef  = useRef(restitution);   rRef.current  = restitution;
  const fRef  = useRef(friction);      fRef.current  = friction;
  const faRef = useRef(frictionAir);   faRef.current = frictionAir;
  const dRef  = useRef(density);       dRef.current  = density;
  const ddRef = useRef(dropDelay);     ddRef.current = dropDelay;
  const iiRef = useRef(initialImpulse);iiRef.current = initialImpulse;
  const rdRef = useRef(returnDelay);   rdRef.current = returnDelay;

  // ── React state ───────────────────────────────────────────────────────────
  const [showBadge, setShowBadge] = useState(false);

  // ── Phase ─────────────────────────────────────────────────────────────────
  const phase = useSandboxPhase();

  // ── THE single effect ─────────────────────────────────────────────────────
  // Only [phase] in deps. Everything else is read from refs at call time.
  // This guarantees the effect never re-runs for reasons unrelated to phase.
  useEffect(() => {
    // ── helpers local to this closure (no external deps needed) ───────────
    const clearTimer = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    const stopRAF = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    const dropBody = () => {
      if (bodyRef.current) {
        removeBody(bodyRef.current);
        bodyRef.current = null;
      }
    };

    // ── IDLE — full reset ─────────────────────────────────────────────────
    if (phase === "idle") {
      returnAnim.current?.stop();
      returnAnim.current = null;
      clearTimer();
      stopRAF();
      dropBody();
      returningRef.current = false;
      originRef.current    = null;
      const el = wrapperRef.current;
      if (el) {
        restoreCSSFlow(el);
        el.style.boxShadow  = "";
        el.style.transition = "";
      }
      setShowBadge(false);
      return;
    }

    // ── CRASHED / HEALING — activate physics ──────────────────────────────
    if (phase === "crashed" || phase === "healing") {
      if (bodyRef.current) return; // already active — guard against re-run

      timerRef.current = setTimeout(() => {
        const el = wrapperRef.current;
        if (!el || bodyRef.current) return;

        const rect = el.getBoundingClientRect();
        const cw = rect.width, ch = rect.height;
        if (cw <= 0 || ch <= 0) return;

        dimRef.current    = { w: cw, h: ch };
        originRef.current = { left: rect.left, top: rect.top };

        el.style.position      = "fixed";
        el.style.left          = "0";
        el.style.top           = "0";
        el.style.width         = `${cw}px`;
        el.style.height        = `${ch}px`;
        el.style.margin        = "0";
        el.style.transform     = `translate(${rect.left}px, ${rect.top}px)`;
        el.style.pointerEvents = "none";
        el.style.zIndex        = "9999";
        el.style.willChange    = "transform";

        const body = Matter.Bodies.rectangle(
          rect.left + cw / 2, rect.top + ch / 2, cw, ch,
          {
            restitution: rRef.current,
            friction:    fRef.current,
            frictionAir: faRef.current,
            density:     dRef.current,
            label:       "physics-node",
            chamfer:     { radius: 4 },
          },
        );
        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 6  * iiRef.current,
          y: (Math.random() * -4 - 1)   * iiRef.current,
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3 * iiRef.current);

        bodyRef.current = body;
        addBody(body);
        getPhysicsEngine();
        enablePhysicsPointer();

        // RAF sync loop — reads only refs, safe as a local function
        const tick = () => {
          const te = wrapperRef.current;
          const tb = bodyRef.current;
          if (!te || !tb) return;
          const { x, y } = tb.position;
          const { w, h } = dimRef.current;
          te.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${tb.angle}rad)`;
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      }, ddRef.current);

      return () => clearTimer();
    }

    // ── VERIFIED — spring return to origin ───────────────────────────────
    if (phase === "verified") {
      if (returningRef.current) return; // guard: don't animate twice

      const el = wrapperRef.current;
      if (!el || el.style.position !== "fixed") return; // not in physics mode

      const origin = originRef.current;
      if (!origin) return;

      returningRef.current = true;

      // Freeze physics immediately (before the return delay)
      stopRAF();
      dropBody();

      const startX     = parseTranslate(el.style.transform)?.x ?? origin.left;
      const startY     = parseTranslate(el.style.transform)?.y ?? origin.top;
      const startAngle = parseRotate(el.style.transform);

      // Apply anti-gravity glow
      el.style.transition = "box-shadow 0.35s ease, filter 0.35s ease";
      el.style.outline    = "1.5px solid rgba(74,222,128,0.7)";
      el.style.boxShadow  =
        "0 0 18px rgba(74,222,128,0.75), 0 0 40px rgba(74,222,128,0.35), " +
        "inset 0 0 16px rgba(74,222,128,0.12)";
      el.style.filter     = "brightness(1.08) drop-shadow(0 0 6px rgba(74,222,128,0.6))";
      el.style.zIndex     = "10001";

      timerRef.current = setTimeout(() => {
        const controls = animate(0, 1, {
          type:      "spring",
          stiffness: 52,
          damping:   17,
          restDelta: 0.0008,
          onUpdate: (p) => {
            const ae = wrapperRef.current;
            if (!ae) return;
            ae.style.transform =
              `translate(${startX + (origin.left - startX) * p}px,` +
              ` ${startY + (origin.top  - startY) * p}px)` +
              ` rotate(${startAngle * (1 - p)}rad)`;
          },
          onComplete: () => {
            const fe = wrapperRef.current;
            if (!fe) return;
            fe.style.transform = `translate(${origin.left}px, ${origin.top}px) rotate(0rad)`;

            // Small settle delay before snapping back to CSS flow
            timerRef.current = setTimeout(() => {
              const se = wrapperRef.current;
              if (!se) return;
              restoreCSSFlow(se);
              se.style.transition = "box-shadow 0.4s ease";
              se.style.boxShadow  =
                "0 0 12px rgba(74,222,128,0.55), 0 0 24px rgba(74,222,128,0.2)";

              setShowBadge(true);

              // Glow fade-out
              timerRef.current = setTimeout(() => {
                const ge = wrapperRef.current;
                if (!ge) return;
                ge.style.transition = "box-shadow 2.8s ease";
                ge.style.boxShadow  = "";
              }, 4000);
            }, 80);
          },
        });
        returnAnim.current = controls;
      }, rdRef.current);

      return () => {
        clearTimer();
        returnAnim.current?.stop();
        returnAnim.current = null;
      };
    }
  }, [phase]); // ← THE ONLY DEP — prevents all re-run cascade issues

  // ── Unmount cleanup ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      returnAnim.current?.stop();
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      if (rafRef.current  !== null) cancelAnimationFrame(rafRef.current);
      if (bodyRef.current)          { removeBody(bodyRef.current); bodyRef.current = null; }
    };
  }, []); // empty deps — runs only on unmount

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      className={className}
      style={showBadge ? { ...style, position: "relative" } : style}
    >
      {children}
      <AnimatePresence>
        {showBadge && <VerifiedBadge key="verified-badge" />}
      </AnimatePresence>
    </div>
  );
}
