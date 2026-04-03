"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const SEED_PARTICLES = [
  { x: 12, y: 18, size: 2.4, duration: 22 },
  { x: 34, y: 55, size: 1.6, duration: 28 },
  { x: 58, y: 8, size: 2.8, duration: 19 },
  { x: 75, y: 72, size: 1.8, duration: 25 },
  { x: 88, y: 33, size: 2.2, duration: 32 },
  { x: 22, y: 85, size: 1.4, duration: 21 },
];

export function FloatingParticles() {
  const particles = useMemo(
    () =>
      SEED_PARTICLES.map((p, i) => ({
        ...p,
        id: i,
        yOffset: i % 2 === 0 ? -18 : -14,
        xOffset: i % 3 === 0 ? 8 : i % 3 === 1 ? -8 : 10,
        delay: i * 2.5,
      })),
    [],
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-muted-foreground/10 dark:bg-muted-foreground/5"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            willChange: "transform, opacity",
          }}
          animate={{
            y: [0, p.yOffset, 0],
            x: [0, p.xOffset, 0],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
