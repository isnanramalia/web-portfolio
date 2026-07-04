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
        className="w-[150px] h-[38px] bg-muted/40 border border-border/40 shrink-0" 
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
    <button
      onClick={handleToggle}
      className={cn(
        "relative flex items-center justify-between p-1 cursor-pointer select-none w-[150px] h-[38px] focus:outline-none shrink-0",
        // Consistent styling matching the search button's border, text, and hover classes
        "border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted/40 transition-all duration-150"
      )}
      style={{
        borderRadius: "10px 3px 10px 3px / 3px 10px 3px 10px"
      }}
      aria-label={isDark ? "Switch to Build Mode" : "Switch to Break Mode"}
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
      <div className="relative flex-1 flex items-center justify-center h-full z-10 font-bold text-xs font-mono select-none">
        <span
          className={cn(
            "flex items-center gap-1 transition-colors duration-300",
            !isDark ? "text-[#FAF8F5]" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Build</span>
        </span>
      </div>

      {/* Option 2: Break */}
      <div className="relative flex-1 flex items-center justify-center h-full z-10 font-bold text-xs font-mono select-none">
        <span
          className={cn(
            "flex items-center gap-1 transition-colors duration-300",
            isDark ? "text-[#D6C0B3]" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Bug className="w-3.5 h-3.5" />
          <span>Break</span>
        </span>
      </div>
    </button>
  );
}
