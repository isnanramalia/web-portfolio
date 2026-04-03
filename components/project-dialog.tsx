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
  layoutId?: string;
}

export function ProjectDialog({
  project,
  open,
  onOpenChange,
  layoutId,
}: ProjectDialogProps) {
  if (!project) return null;

  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              layoutId={layoutId || `project-${project.title}`}
              className="relative bg-background rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-2xl border border-border"
              layout
              transition={{
                layout: {
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                },
              }}
            >
              <div className="p-6 pb-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <motion.h2
                    layoutId={`project-title-${project.title}`}
                    className="text-2xl font-bold text-foreground pr-8"
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {project.title}
                  </motion.h2>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.2, duration: 0.2, ease: "easeOut" }}
                    onClick={() => onOpenChange(false)}
                    className="p-2 rounded-2xl hover:bg-accent transition-colors shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 pb-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <motion.div
                      layoutId={`project-image-${project.title}`}
                      className="w-full h-64 overflow-hidden rounded-2xl"
                    >
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.25,
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                      About This Project
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {project.longDescription || project.description}
                    </p>
                  </motion.div>

                  {project.features && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.3,
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                    >
                      <h3 className="text-lg font-semibold mb-3 text-foreground">
                        Key Features
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {project.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.35 + index * 0.03,
                              duration: 0.2,
                              ease: "easeOut",
                            }}
                          >
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.45,
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.5 + index * 0.02,
                            duration: 0.2,
                            ease: "easeOut",
                          }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-accent text-accent-foreground border-border rounded-xl"
                          >
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {(project.githubFe ||
                    project.githubBe ||
                    project.website) && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.6,
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                      className="flex flex-wrap gap-3 pt-4"
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
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
