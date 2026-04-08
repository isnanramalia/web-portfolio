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
          <div className="mb-2 flex select-none items-baseline gap-2.5">
            {WORDS.map((word, i) => (
              <motion.span
                key={i}
                className="text-4xl font-bold tracking-wide text-foreground"
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
            className="mb-10 text-sm tracking-wide text-muted-foreground"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.28, ease: "easeOut" }}
          >
            Frontend Developer · QA Practitioner
          </motion.p>

          <motion.div
            className="flex w-56 flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.24 }}
          >
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.12, ease: "easeOut" }}
              />
            </div>

            <p className="text-xs tabular-nums text-muted-foreground">
              {Math.round(progress)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
