"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;

    const readProgress = () => {
      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      const nextVisible = nextProgress > 0.08;

      setProgress((prev) =>
        Math.abs(prev - nextProgress) < 0.001 ? prev : nextProgress,
      );
      setVisible((prev) => (prev === nextVisible ? prev : nextVisible));
      rafId = null;
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(readProgress);
    };

    readProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const r = 20;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="fixed bottom-6 right-4 sm:right-6 z-40 w-12 h-12 select-none"
          aria-label="Scroll back to top"
          initial={{ opacity: 0, scale: 0.4, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 16 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Scroll-progress ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 48 48"
            aria-hidden
          >
            {/* Track */}
            <circle
              cx="24"
              cy="24"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-border"
            />
            {/* Filled arc */}
            <circle
              cx="24"
              cy="24"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-primary"
              style={{ transition: "stroke-dashoffset 0.12s linear" }}
            />
          </svg>

          {/* Center button body */}
          <div className="absolute inset-[5px] rounded-full bg-background border border-border shadow-sm flex items-center justify-center overflow-hidden">
            <motion.span
              className="absolute text-[11px] font-bold text-primary tabular-nums leading-none"
              animate={{
                y: hovered ? -20 : 0,
                opacity: hovered ? 0 : 1,
              }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
              aria-hidden
            >
              {Math.round(progress * 100)}
            </motion.span>

            {/* Arrow — slides in on hover */}
            <motion.div
              className="absolute flex items-center justify-center"
              animate={{
                y: hovered ? 0 : 20,
                opacity: hovered ? 1 : 0,
              }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
              aria-hidden
            >
              <ArrowUp className="w-4 h-4 text-primary" strokeWidth={2.5} />
            </motion.div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
