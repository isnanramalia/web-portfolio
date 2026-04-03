"use client";

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

export function ProjectDialog({
  project,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  if (!project) return null;

  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="dialog"
              className="relative bg-background rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-2xl border border-border pointer-events-auto"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <motion.h2
                    className="text-2xl font-bold text-foreground pr-8"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.2, ease: "easeOut" }}
                  >
                    {project.title}
                  </motion.h2>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.18, ease: "easeOut" }}
                    onClick={() => onOpenChange(false)}
                    className="p-2 rounded-2xl hover:bg-accent transition-colors shrink-0"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 pb-6">
                <div className="space-y-6 pt-4">
                  {/* Image */}
                  <motion.div
                    className="overflow-hidden rounded-2xl"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.1,
                      duration: 0.25,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <div className="w-full h-64 overflow-hidden rounded-2xl">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </div>
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    variants={CONTENT_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    custom={0.18}
                  >
                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                      About This Project
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
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
                      <h3 className="text-lg font-semibold mb-3 text-foreground">
                        Key Features
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
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
                    custom={project.features ? 0.3 : 0.24}
                  >
                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-accent text-accent-foreground border-border rounded-xl"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>

                  {/* Links */}
                  {(project.githubFe ||
                    project.githubBe ||
                    project.website) && (
                    <motion.div
                      variants={CONTENT_VARIANTS}
                      initial="hidden"
                      animate="visible"
                      custom={project.features ? 0.36 : 0.3}
                      className="flex flex-wrap gap-3 pt-2"
                    >
                      {project.githubFe && (
                        <Button
                          asChild
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl smooth-hover"
                        >
                          <a
                            href={project.githubFe}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <Github className="w-4 h-4 mr-2" />
                            {project.githubBe ? "Frontend Repo" : "View Code"}
                          </a>
                        </Button>
                      )}
                      {project.githubBe && (
                        <Button
                          asChild
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl smooth-hover"
                        >
                          <a
                            href={project.githubBe}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <Github className="w-4 h-4 mr-2" />
                            Backend API
                          </a>
                        </Button>
                      )}
                      {project.website && (
                        <Button
                          variant="outline"
                          asChild
                          className="border-border text-foreground hover:bg-accent rounded-2xl bg-transparent smooth-hover"
                        >
                          <a
                            href={project.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {project.category === "qa"
                              ? "View Documentation"
                              : "Live Demo"}
                          </a>
                        </Button>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
