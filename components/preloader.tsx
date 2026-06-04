"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = ["Isna", "Nur", "Amalia"];

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let current = 0;
    let stepTimeout: ReturnType<typeof setTimeout> | null = null;
    let finishTimeout: ReturnType<typeof setTimeout> | null = null;

    const clearTimers = () => {
      if (stepTimeout) clearTimeout(stepTimeout);
      if (finishTimeout) clearTimeout(finishTimeout);
    };

    const step = () => {
      if (cancelled) return;

      const remaining = 100 - current;
      const isFinalStretch = current >= 88;
      const increment = isFinalStretch
        ? 2.4 + Math.random() * 1.2
        : Math.max(6, remaining * 0.16) + Math.random() * 3;

      current = Math.min(current + increment, 100);
      setProgress(current);

      if (current >= 100) {
        finishTimeout = setTimeout(() => {
          if (!cancelled) {
            setLoading(false);
            onComplete?.();
          }
        }, 140);
        return;
      }

      stepTimeout = setTimeout(step, isFinalStretch ? 55 : 40);
    };

    stepTimeout = setTimeout(step, 120);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Doodle decorations in loading screen */}
          <svg
            className="absolute top-8 right-12 opacity-[0.08] text-foreground pointer-events-none"
            width="60"
            height="60"
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="32" cy="32" r="19" strokeWidth="3.5" />
            <line
              x1="46"
              y1="46"
              x2="70"
              y2="70"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="absolute bottom-10 left-10 opacity-[0.07] text-foreground pointer-events-none"
            width="48"
            height="48"
            viewBox="0 0 60 60"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="30" cy="30" r="25" strokeWidth="2.5" />
            <polyline points="17,30 25,40 44,20" strokeWidth="3.8" />
          </svg>

          <div className="mb-2 flex select-none items-baseline gap-3">
            {WORDS.map((word, i) => (
              <motion.span
                key={i}
                className="text-4xl font-bold tracking-wide text-foreground font-handwritten"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 * i + 0.08,
                  duration: 0.38,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="mb-10 text-sm tracking-wide text-muted-foreground font-handwritten"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.28, ease: "easeOut" }}
          >
            Frontend Developer · QA Practitioner
          </motion.p>

          <motion.div
            className="flex w-64 flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.24 }}
          >
            <div className="pencil-track h-2 w-full overflow-hidden">
              <motion.div
                className="pencil-fill h-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.12, ease: "easeOut" }}
              />
            </div>

            <p className="text-xs tabular-nums text-muted-foreground font-handwritten">
              {Math.round(progress)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
