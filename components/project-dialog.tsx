"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Github,
  ExternalLink,
  X,
  Bug,
  CheckCircle,
  Users,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface Project {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubFe?: string;
  githubBe?: string;
  website?: string;
  longDescription?: string;
  features?: string[];
  category?: string;
}

interface ProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ── Category color helpers ─────────────────────────────────────────────────

function getCategoryBg(category?: string): string {
  switch (category) {
    case "qa":
      return "linear-gradient(to bottom, #dcfce7, #f8fff9 60%)";
    case "mobile":
      return "linear-gradient(to bottom, #dbeafe, #f8fbff 60%)";
    default:
      return "linear-gradient(to bottom, #fef9c3, #fefff8 60%)";
  }
}

function getCategoryBgDark(category?: string): string {
  switch (category) {
    case "qa":
      return "#0e3119";
    case "mobile":
      return "#102440";
    default:
      return "#3d3610";
  }
}

function getCategoryBorder(category?: string): string {
  switch (category) {
    case "qa":
      return "#bbf7d0";
    case "mobile":
      return "#bfdbfe";
    default:
      return "#fde68a";
  }
}

function getCategoryBorderDark(category?: string): string {
  switch (category) {
    case "qa":
      return "#166534";
    case "mobile":
      return "#1e3a5f";
    default:
      return "#92400e";
  }
}

// ── QA Project Metadata ───────────────────────────────────────────────────
// Per-project QA stats shown in the dialog for qa-category projects
const QA_PROJECT_META: Record<
  string,
  {
    stats: Array<{
      value: string;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
    }>;
    bugBreakdown?: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    process?: string[];
  }
> = {
  "Manual Testing – Saucedemo (Swag Labs)": {
    stats: [
      { value: "30+", label: "Test Cases", icon: CheckCircle },
      { value: "9", label: "Bugs Found", icon: Bug },
      { value: "3", label: "User Types", icon: Users },
      { value: "STLC", label: "Methodology", icon: BarChart3 },
    ],
    bugBreakdown: { critical: 2, high: 4, medium: 1, low: 2 },
    process: [
      "Test Plan",
      "Test Scenarios",
      "Test Cases",
      "Execution",
      "Bug Reports",
      "Summary",
    ],
  },
  "UAT Testing – STI Alumni Website": {
    stats: [
      { value: "75", label: "Respondents", icon: Users },
      { value: "84%", label: "Satisfaction", icon: BarChart3 },
      { value: "UAT", label: "Test Type", icon: CheckCircle },
      { value: "5★", label: "Usability", icon: Bug },
    ],
    process: [
      "Survey Design",
      "User Recruitment",
      "Testing Sessions",
      "Data Collection",
      "Analysis",
      "Report",
    ],
  },
};

const BUG_SEV_COLORS = {
  critical: {
    bg: "#fef2f2",
    text: "#b91c1c",
    darkBg: "#3f0f0f",
    darkText: "#fca5a5",
  },
  high: {
    bg: "#fff7ed",
    text: "#c2410c",
    darkBg: "#3f1800",
    darkText: "#fdba74",
  },
  medium: {
    bg: "#fefce8",
    text: "#a16207",
    darkBg: "#3f2c00",
    darkText: "#fcd34d",
  },
  low: {
    bg: "#eff6ff",
    text: "#1d4ed8",
    darkBg: "#0f1f3f",
    darkText: "#93c5fd",
  },
};

// ── Animation variants ─────────────────────────────────────────────────────

const CONTENT_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.22,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

// useLayoutEffect fires synchronously before paint — ensures correct value
// even on first render. Safe here because this component is ssr:false.
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

function ActionButtons({
  project,
  fullWidth = false,
}: {
  project: Project;
  fullWidth?: boolean;
}) {
  const cls = cn(
    "btn-sticker-apply",
    fullWidth ? "flex-1 justify-center" : "smooth-hover",
  );

  return (
    <>
      {project.githubFe && (
        <Button
          asChild
          className={cn(
            "btn-sticker-primary-apply bg-primary hover:bg-primary/90 text-primary-foreground",
            cls,
          )}
        >
          <a
            href={project.githubFe}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Github className="w-4 h-4 mr-2 shrink-0" />
            {project.githubBe ? "Frontend Repo" : "View Code"}
          </a>
        </Button>
      )}
      {project.githubBe && (
        <Button
          asChild
          className={cn(
            "btn-sticker-primary-apply bg-primary hover:bg-primary/90 text-primary-foreground",
            cls,
          )}
        >
          <a
            href={project.githubBe}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Github className="w-4 h-4 mr-2 shrink-0" />
            Backend API
          </a>
        </Button>
      )}
      {project.website && (
        <Button
          variant="outline"
          asChild
          className={cn(
            "btn-sticker-apply border-border text-foreground hover:bg-accent bg-transparent",
            cls,
          )}
        >
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-2 shrink-0" />
            {project.category === "qa" ? "View Documentation" : "Live Demo"}
          </a>
        </Button>
      )}
    </>
  );
}

export function ProjectDialog({
  project,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted || !open) return;
    // Prevent background scrolling while dialog is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted, open]);

  if (!project) return null;
  if (!mounted) return null;

  const hasLinks = !!(project.githubFe || project.githubBe || project.website);
  const featuresDelay = project.features ? 0.3 : 0.24;

  const content = (
    <AnimatePresence mode="wait">
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={() => onOpenChange(false)}
          />

          {/* ── Container ── */}
          <div
            className={cn(
              "fixed inset-0 z-[10000] pointer-events-none",
              isMobile
                ? "flex flex-col justify-end"
                : "flex items-center justify-center p-4",
            )}
          >
            <motion.div
              key="dialog"
              className={cn(
                "relative shadow-2xl pointer-events-auto flex flex-col overflow-hidden",
                isMobile ? "w-full rounded-t-3xl" : "max-w-4xl w-full",
              )}
              style={{
                maxHeight: "90dvh",
                background: isDark
                  ? getCategoryBgDark(project.category)
                  : getCategoryBg(project.category),
                border: `2px solid ${
                  isDark
                    ? getCategoryBorderDark(project.category)
                    : getCategoryBorder(project.category)
                }`,
                ...(isMobile
                  ? {}
                  : { borderRadius: "22px 6px 22px 6px / 6px 22px 6px 22px" }),
              }}
              initial={
                isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 16 }
              }
              animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={
                isMobile ? { y: "100%" } : { opacity: 0, scale: 0.97, y: 8 }
              }
              transition={
                isMobile
                  ? { type: "spring", damping: 28, stiffness: 280 }
                  : { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }
              }
            >
              {/* Tape decoration — desktop only */}
              {!isMobile && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 z-10 pointer-events-none"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    borderRadius: "0 0 3px 3px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Mobile drag handle */}
              {isMobile && (
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                  <div className="w-10 h-1 rounded-full bg-muted-foreground/25" />
                </div>
              )}

              {/* ── Header ── */}
              <div className="px-6 pt-4 pb-4 border-b border-black/10 dark:border-white/10 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <motion.h2
                    className="text-xl font-bold text-foreground leading-snug"
                    style={{ fontFamily: "var(--font-kalam), cursive" }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.2, ease: "easeOut" }}
                  >
                    {project.title}
                  </motion.h2>

                  <motion.button
                    className="p-2 hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0 -mr-1"
                    style={{ borderRadius: "6px 14px 6px 14px" }}
                    aria-label="Close dialog"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.18, ease: "easeOut" }}
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* ── Scrollable content ── */}
              <div className="overflow-y-auto flex-1 px-6 pb-4 overscroll-contain">
                <div className="space-y-5 pt-4">
                  {/* Image — polaroid style */}
                  <motion.div
                    className={cn("w-full", isMobile ? "h-44" : "h-64")}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.1,
                      duration: 0.25,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{
                        background: "white",
                        padding: "5px 5px 22px 5px",
                        boxShadow: "1px 2px 5px rgba(0,0,0,0.14)",
                        height: "100%",
                      }}
                    >
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover block transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </motion.div>

                  {/* QA Project Stats — shown only for QA category */}
                  {project.category === "qa" &&
                    QA_PROJECT_META[project.title] &&
                    (() => {
                      const meta = QA_PROJECT_META[project.title]!;
                      return (
                        <motion.div
                          variants={CONTENT_VARIANTS}
                          initial="hidden"
                          animate="visible"
                          custom={0.14}
                        >
                          {/* Stats grid */}
                          <div className="grid grid-cols-4 gap-2 mb-3">
                            {meta.stats.map((stat) => (
                              <div
                                key={stat.label}
                                className="text-center p-2 rounded-lg"
                                style={{
                                  background: isDark
                                    ? "rgba(255,255,255,0.06)"
                                    : "rgba(0,0,0,0.04)",
                                  borderRadius:
                                    "8px 3px 8px 3px / 3px 8px 3px 8px",
                                }}
                              >
                                <stat.icon className="w-4 h-4 mx-auto mb-0.5 text-primary opacity-70" />
                                <div
                                  className="text-base font-bold"
                                  style={{
                                    fontFamily: "var(--font-kalam), cursive",
                                  }}
                                >
                                  {stat.value}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Bug breakdown — only for Saucedemo project */}
                          {meta.bugBreakdown && (
                            <div className="mb-3">
                              <p
                                className="text-xs font-bold mb-2"
                                style={{
                                  fontFamily: "var(--font-kalam), cursive",
                                }}
                              >
                                Bug Severity Breakdown
                              </p>
                              <div className="flex gap-1.5 flex-wrap">
                                {(
                                  Object.entries(meta.bugBreakdown) as Array<
                                    [keyof typeof BUG_SEV_COLORS, number]
                                  >
                                ).map(([sev, count]) => {
                                  const col = BUG_SEV_COLORS[sev];
                                  return (
                                    <span
                                      key={sev}
                                      className="text-[11px] font-bold px-2 py-0.5 capitalize"
                                      style={{
                                        background: isDark
                                          ? col.darkBg
                                          : col.bg,
                                        color: isDark ? col.darkText : col.text,
                                        borderRadius: "4px 8px 4px 8px",
                                      }}
                                    >
                                      {sev}: {count}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* QA Process breadcrumb */}
                          {meta.process && (
                            <div className="flex flex-wrap items-center gap-1">
                              {meta.process.map((step, i) => (
                                <span
                                  key={step}
                                  className="flex items-center gap-1"
                                >
                                  <span className="text-[10px] font-mono text-muted-foreground">
                                    {step}
                                  </span>
                                  {i < meta.process!.length - 1 && (
                                    <span className="text-[10px] text-muted-foreground/40">
                                      →
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })()}

                  {/* Description */}
                  <motion.div
                    variants={CONTENT_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    custom={0.18}
                  >
                    <h3
                      className="text-base font-semibold mb-2 text-foreground"
                      style={{ fontFamily: "var(--font-kalam), cursive" }}
                    >
                      {project.category === "qa"
                        ? "What I Tested"
                        : "About This Project"}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.longDescription || project.description}
                    </p>
                  </motion.div>

                  {/* Features */}
                  {project.features && (
                    <motion.div
                      variants={CONTENT_VARIANTS}
                      initial="hidden"
                      animate="visible"
                      custom={0.24}
                    >
                      <h3
                        className="text-base font-semibold mb-2 text-foreground"
                        style={{ fontFamily: "var(--font-kalam), cursive" }}
                      >
                        {project.category === "qa"
                          ? "Test Coverage & Findings"
                          : "Key Features"}
                      </h3>
                      <ul className="space-y-1.5">
                        {project.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex gap-2 text-sm text-muted-foreground"
                          >
                            <span className="text-primary shrink-0 mt-0.5">
                              {project.category === "qa" ? "✓" : "•"}
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Tech stack */}
                  <motion.div
                    variants={CONTENT_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    custom={featuresDelay}
                  >
                    <h3
                      className="text-base font-semibold mb-2 text-foreground"
                      style={{ fontFamily: "var(--font-kalam), cursive" }}
                    >
                      {project.category === "qa"
                        ? "Tools & Methods"
                        : "Technologies Used"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-0.5 font-mono font-semibold"
                          style={{
                            background: "rgba(0,0,0,0.07)",
                            borderRadius: "2px 6px 2px 6px / 6px 2px 6px 2px",
                            border: "1px dashed rgba(0,0,0,0.2)",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Action buttons — desktop only, inside scroll */}
                  {!isMobile && hasLinks && (
                    <motion.div
                      variants={CONTENT_VARIANTS}
                      initial="hidden"
                      animate="visible"
                      custom={featuresDelay + 0.06}
                      className="flex flex-wrap gap-3 pt-2 pb-2"
                    >
                      <ActionButtons project={project} />
                    </motion.div>
                  )}
                </div>
              </div>

              {isMobile && hasLinks && (
                <motion.div
                  className="shrink-0 px-6 py-4 border-t border-black/10 dark:border-white/10 bg-transparent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.2, ease: "easeOut" }}
                >
                  <div className="flex gap-3">
                    <ActionButtons project={project} fullWidth />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // Portal ensures the fixed dialog layer is not affected by stacking contexts
  // from parent wrappers (e.g. `relative z-10` in the page).
  return createPortal(content, document.body);
}
