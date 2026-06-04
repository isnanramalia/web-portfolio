"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// ── Types ──────────────────────────────────────────────────────────────────

interface IsnaLogoProps {
  size?: "sm" | "md" | "lg";
  /** kept for backward compat — no longer changes appearance */
  variant?: "default" | "minimal" | "gradient";
  className?: string;
}

// ── Size map ───────────────────────────────────────────────────────────────

const SIZE_PX: Record<string, number> = { sm: 64, md: 80, lg: 128 };
const SIZE_CLASS: Record<string, string> = {
  sm: "w-12 h-12",
  md: "w-14 h-14",
  lg: "w-16 h-16",
};

export function IsnaLogo({ size = "md", className = "" }: IsnaLogoProps) {
  const [hovered, setHovered] = useState(false);
  const px = SIZE_PX[size] ?? 40;

  return (
    <motion.div
      className={`relative overflow-hidden shrink-0 ${SIZE_CLASS[size]} ${className}`}
      style={{ borderRadius: "50%" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 380, damping: 20 }}
    >
      {/* ── Default character (char1) ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <Image
          src="/char1.png"
          alt="Isna Nur Amalia"
          width={px}
          height={px}
          className="w-full h-full object-cover"
          priority
          draggable={false}
        />
      </motion.div>

      {/* ── Hover character (char2 — smiling) ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <Image
          src="/char2.png"
          alt="Isna Nur Amalia smiling"
          width={px}
          height={px}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}

// ── IsnaTextLogo — logo + name side by side ────────────────────────────────

export function IsnaTextLogo({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center space-x-3 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <IsnaLogo size="md" />
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <span className="text-2xl font-bold text-foreground tracking-wider">
          {["I", "S", "N", "A"].map((letter, i) => (
            <motion.span
              key={letter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ── IsnaAnimatedLogo — kept for any existing usages ────────────────────────
// (If nothing else references this, it can be removed later.)

export function IsnaAnimatedLogo({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <IsnaLogo size="lg" />
    </motion.div>
  );
}
