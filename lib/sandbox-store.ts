/**
 * sandbox-store.ts
 *
 * Global state for the "Chaos Sandbox: System Overhaul" feature.
 *
 * State machine:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  idle  ──[triggerCrash]──► crashed                          │
 *  │  crashed ──[triggerHeal]──► healing ──[completeHeal]──►     │
 *  │  verified ──[reset]──► idle                                 │
 *  └─────────────────────────────────────────────────────────────┘
 */

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SandboxPhase =
  | "idle"       // Default: normal portfolio view
  | "crashed"    // Physics engine active — elements are falling / displaced
  | "healing"    // QA terminal is running auto-heal sequence
  | "verified";  // Heal complete — layout restored, success state shown

export interface SandboxState {
  /** True while elements are in chaotic / physics-driven positions */
  isCrashed: boolean;

  /** True while the QA auto-heal terminal animation is running */
  isHealing: boolean;

  /** True after the heal sequence finishes successfully */
  isVerified: boolean;

  /** Derived convenience: current phase of the sandbox lifecycle */
  phase: SandboxPhase;

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  /** Activate chaos — kick off the physics engine, set isCrashed = true */
  triggerCrash: () => void;

  /** Begin the healing sequence (called after crash is fully settled) */
  triggerHeal: () => void;

  /** Mark the healing as complete — transition to "verified" */
  completeHeal: () => void;

  /** Reset everything back to the idle / normal state */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Initial snapshot
// ---------------------------------------------------------------------------

const initialState: Pick<
  SandboxState,
  "isCrashed" | "isHealing" | "isVerified" | "phase"
> = {
  isCrashed: false,
  isHealing: false,
  isVerified: false,
  phase: "idle",
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSandboxStore = create<SandboxState>()((set) => ({
  ...initialState,

  triggerCrash: () =>
    set({
      isCrashed: true,
      isHealing: false,
      isVerified: false,
      phase: "crashed",
    }),

  triggerHeal: () =>
    set((state) => {
      if (!state.isCrashed) return state;
      return {
        isCrashed: true,
        isHealing: true,
        isVerified: false,
        phase: "healing",
      };
    }),

  completeHeal: () =>
    set({
      isCrashed: false,
      isHealing: false,
      isVerified: true,
      phase: "verified",
    }),

  reset: () => set({ ...initialState }),
}));

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

/** Returns only the three boolean flags */
export const useSandboxFlags = () =>
  useSandboxStore(
    useShallow((s) => ({
      isCrashed: s.isCrashed,
      isHealing:  s.isHealing,
      isVerified: s.isVerified,
    })),
  );

/** Returns only the current phase string — scalar, always stable */
export const useSandboxPhase = () => useSandboxStore((s) => s.phase);

/**
 * Returns all action dispatchers.
 * useShallow prevents re-renders when the state shape changes but
 * the action references themselves (which are stable) have not.
 */
export const useSandboxActions = () =>
  useSandboxStore(
    useShallow((s) => ({
      triggerCrash: s.triggerCrash,
      triggerHeal:  s.triggerHeal,
      completeHeal: s.completeHeal,
      reset:        s.reset,
    })),
  );

/** Single-action selectors — use these to avoid subscribing to the full actions object */
export const useTriggerCrash  = () => useSandboxStore((s) => s.triggerCrash);
export const useTriggerHeal   = () => useSandboxStore((s) => s.triggerHeal);
export const useCompleteHeal  = () => useSandboxStore((s) => s.completeHeal);
export const useResetSandbox  = () => useSandboxStore((s) => s.reset);
