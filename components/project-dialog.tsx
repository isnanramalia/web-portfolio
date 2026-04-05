"use client";

import { useLayoutEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
    "rounded-2xl",
    fullWidth ? "flex-1 justify-center" : "smooth-hover",
  );

  return (
    <>
      {project.githubFe && (
        <Button
          asChild
          className={cn(
            "bg-primary hover:bg-primary/90 text-primary-foreground",
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
            "bg-primary hover:bg-primary/90 text-primary-foreground",
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
            "border-border text-foreground hover:bg-accent bg-transparent",
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
  const isMobile = useIsMobile();

  if (!project) return null;

  const hasLinks = !!(project.githubFe || project.githubBe || project.website);
  const featuresDelay = project.features ? 0.3 : 0.24;

  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={() => onOpenChange(false)}
          />

          {/* ── Container ── */}
          <div
            className={cn(
              "fixed inset-0 z-50 pointer-events-none",
              isMobile
                ? "flex flex-col justify-end"
                : "flex items-center justify-center p-4",
            )}
          >
            <motion.div
              key="dialog"
              className={cn(
                "relative bg-background shadow-2xl border border-border pointer-events-auto flex flex-col overflow-hidden",
                isMobile
                  ? "w-full rounded-t-3xl border-b-0"
                  : "rounded-2xl max-w-4xl w-full",
              )}
              style={{ maxHeight: "90dvh" }}
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
              {/* Mobile drag handle */}
              {isMobile && (
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                  <div className="w-10 h-1 rounded-full bg-muted-foreground/25" />
                </div>
              )}

              {/* ── Header ── */}
              <div className="px-6 pt-4 pb-4 border-b border-border shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <motion.h2
                    className="text-xl font-bold text-foreground leading-snug"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.2, ease: "easeOut" }}
                  >
                    {project.title}
                  </motion.h2>

                  <motion.button
                    className="p-2 rounded-2xl hover:bg-accent transition-colors shrink-0 -mr-1"
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
                  {/* Image */}
                  <motion.div
                    className={cn(
                      "overflow-hidden rounded-2xl w-full",
                      isMobile ? "h-44" : "h-64",
                    )}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.1,
                      duration: 0.25,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={600}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    variants={CONTENT_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    custom={0.18}
                  >
                    <h3 className="text-base font-semibold mb-2 text-foreground">
                      About This Project
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
                      <h3 className="text-base font-semibold mb-2 text-foreground">
                        Key Features
                      </h3>
                      <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                        {project.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
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
                    <h3 className="text-base font-semibold mb-2 text-foreground">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-accent text-accent-foreground border-border rounded-xl text-xs"
                        >
                          {tech}
                        </Badge>
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
                  className="shrink-0 px-6 py-4 border-t border-border bg-background"
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
}
