"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Code, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a matching placeholder skeleton to avoid hydration mismatch
    return (
      <div 
        className="w-[168px] h-[38px] bg-muted/40 border border-border/40 shrink-0" 
        style={{
          borderRadius: "10px 3px 10px 3px / 3px 10px 3px 10px"
        }}
      />
    );
  }

  const isDark = theme === "dark";

  const handleToggle = (e: React.MouseEvent) => {
    const nextTheme = isDark ? "light" : "dark";

    // View transition support with coordinates for wave effect
    document.documentElement.style.setProperty("--theme-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--theme-y", `${e.clientY}px`);

    if (!("startViewTransition" in document)) {
      setTheme(nextTheme);
      return;
    }

    (
      document as Document & { startViewTransition: (cb: () => void) => void }
    ).startViewTransition(() => setTheme(nextTheme));
  };

  return (
    <div className="relative group/tooltip shrink-0">
      <button
        onClick={handleToggle}
        className={cn(
          "relative flex items-center justify-between p-1 select-none w-[168px] h-[38px] shrink-0 cursor-pointer",
          // Consistent styling matching the search button's border, text, and hover classes
          "border border-border text-xs text-muted-foreground hover:border-foreground/30 hover:bg-muted/40 transition-all duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        )}
        style={{
          borderRadius: "10px 3px 10px 3px / 3px 10px 3px 10px"
        }}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle theme mode"
      >
        {/* Sliding Active Pill (Parent-anchored math-safe position) */}
        <motion.div
          className={cn(
            "absolute top-[3px] bottom-[3px] z-0 transition-colors duration-300",
            isDark 
              ? "bg-[#5F4837] border border-[#AB886D]/35" 
              : "bg-[#0B1957]"
          )}
          animate={{
            left: isDark ? "calc(50% + 0px)" : "3px",
          }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 26,
          }}
          style={{
            width: "calc(50% - 3px)",
            borderRadius: "8px 2px 8px 2px / 2px 8px 2px 8px"
          }}
        />

        {/* Option 1: Build */}
        <div
          className={cn(
            "relative flex-1 flex items-center justify-center h-full z-10 font-bold text-xs font-mono select-none transition-colors duration-300",
            !isDark ? "text-[#FAF8F5]" : "text-muted-foreground group-hover/tooltip:text-foreground"
          )}
          style={{
            borderRadius: "8px 2px 8px 2px / 2px 8px 2px 8px"
          }}
        >
          <span className="flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5" />
            <span>Build</span>
          </span>
        </div>

        {/* Option 2: Break */}
        <div
          className={cn(
            "relative flex-1 flex items-center justify-center h-full z-10 font-bold text-xs font-mono select-none transition-colors duration-300",
            isDark ? "text-[#D6C0B3]" : "text-muted-foreground group-hover/tooltip:text-foreground"
          )}
          style={{
            borderRadius: "8px 2px 8px 2px / 2px 8px 2px 8px"
          }}
        >
          <span className="flex items-center gap-1.5">
            <Bug className="w-3.5 h-3.5" />
            <span>Break</span>
          </span>
        </div>
      </button>


      {/* Tooltip */}
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] z-50",
          "flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-[11px] font-mono font-semibold",
          "border shadow-md",
          "opacity-0 translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0",
          "transition-all duration-200 ease-out",
          isDark
            ? "bg-[#493628] border-[#AB886D]/40 text-[#D6C0B3]"
            : "bg-[#0B1957] border-[#3B5BDB]/40 text-[#c8d8ff]"
        )}
        style={{ borderRadius: "6px 2px 6px 2px / 2px 6px 2px 6px" }}
        role="tooltip"
      >
        {isDark ? (
          <>
            <Code className="w-3 h-3" />
            Switch to Build Mode
          </>
        ) : (
          <>
            <Bug className="w-3 h-3" />
            Switch to Break Mode
          </>
        )}
      </div>
    </div>
  );
}
