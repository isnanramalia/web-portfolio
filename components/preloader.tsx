"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { IsnaAnimatedLogo } from "@/components/isna-logo";

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let current = 0;

    const step = () => {
      if (cancelled) return;

      const remaining = 100 - current;
      const increment = Math.max(0.5, remaining * 0.08) + Math.random() * 2;
      current = Math.min(current + increment, 100);
      setProgress(current);

      if (current >= 100) {
        setTimeout(() => {
          if (!cancelled) setLoading(false);
        }, 450);
        return;
      }

      setTimeout(step, 120 + Math.random() * 60);
    };

    const startTimer = setTimeout(step, 380);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <IsnaAnimatedLogo className="w-52 h-20 mb-5" />

          <motion.p
            className="text-sm text-muted-foreground mb-10"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4, ease: "easeOut" }}
          >
            Frontend Developer · QA Practitioner
          </motion.p>

          <motion.div
            className="w-56 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.35 }}
          >
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              />
            </div>

            <p className="text-xs text-muted-foreground tabular-nums">
              {Math.round(progress)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
