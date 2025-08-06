"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";

interface Project {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  techStack: string[];
  features: string[];
  github: string;
  website: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  handleProjectClick: (project: Project) => void;
}

export function ProjectsSection({
  projects,
  handleProjectClick,
}: ProjectsSectionProps) {
  return (
    <motion.section
      id="projects"
      className="px-4 sm:px-6 lg:px-12 py-8 lg:py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-2xl font-medium mb-8 text-foreground"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          Selected Projects
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              layoutId={`project-${project.title}`}
              className="bg-card rounded-2xl p-6 border border-border smooth-hover cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => handleProjectClick(project)}
            >
              <div className="mb-4 overflow-hidden rounded-2xl">
                <motion.div
                  layoutId={`project-image-${project.title}`}
                  className="w-full h-48 overflow-hidden rounded-2xl"
                >
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                  />
                </motion.div>
              </div>
              <div>
                <motion.h3
                  layoutId={`project-title-${project.title}`}
                  className="text-lg font-medium mb-2 group-hover:text-primary transition-colors text-card-foreground"
                >
                  {project.title}
                </motion.h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="text-xs bg-accent text-accent-foreground border-border rounded-xl"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.techStack.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-accent text-accent-foreground border-border rounded-xl"
                    >
                      +{project.techStack.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-4 h-4 mr-1" />
                    Code
                  </a>
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Live
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
